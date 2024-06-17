/*
Fetches data for models from HU Berlin from the DAMM Portal
for a specific collection and saves it to the output folder.
Creates a report of successful and failed fetches.
*/

import fs from 'fs';
import path from 'path';
import { cwd } from 'process';
import { config } from './config/project.js';
import { mapping } from './config/mapping.js';
import { url } from 'inspector';

const root = cwd();

// Utilities

function extractImageData(data) {
    return data
    .map(image => {
        return {
            copyright: image.copyright,
            url: `${config.baseUrl}/${config.imagesPath}${image.image[0].formats.large.url}`
        }
    });
}

async function fetchModels() {
    try {
        let report = {
            success: [],
            error: []
        };

        // Fetch collection information
        const collectionResponse = await fetch(`${config.baseUrl}/${config.collectionInfoPath}/${config.collectionId}`);
        const ids = await collectionResponse.json();

        // Clear and recreate output directories
        fs.rmSync(path.join(root, 'output', 'models'), { recursive: true, force: true });
        fs.rmSync(path.join(root, 'output', 'mapped-models'), { recursive: true, force: true });
        fs.rmSync(path.join(root, 'output', 'reports'), { recursive: true, force: true });
        fs.mkdirSync(path.join(root, 'output', 'models'), { recursive: true });
        fs.mkdirSync(path.join(root, 'output', 'mapped-models'), { recursive: true });
        fs.mkdirSync(path.join(root, 'output', 'reports'), { recursive: true });

        // Fetch each model item
        let models = [];
        // DEV: Placeholder for functionallity to check if a field is used in a given set of items
        let analytics = {
            conditionValues: new Set()
        };
        for (let id of ids.modelitems) {
            const itemsResponse = await fetch(`${config.baseUrl}/${config.itemsPath}/${id}`);
            if (!itemsResponse.ok) {
                report.error.push(id);
                continue;
            }
            report.success.push(id);
            const item = await itemsResponse.json();

            // analytics
            // DEV: Placeholder for functionallity to check if a field is used in a given set of items
            if (item.condition) {
                analytics.conditionValues.add(item.condition);
            }
            // Save each model item
            fs.writeFileSync(path.join(root, 'output', 'models', `${id}.json`), JSON.stringify(item, null, 2));
            // Map each model item and save it
            let mappedItem = {};
            mappedItem.dammId = item.id;
            mappedItem.oldId = item.oldId;
            mappedItem.dammLink = `${config.baseUrl}/${config.guiItemPath}/${item.id}`;
            for (let key in mapping) {
                if (mapping[key].ignore) continue;
                if (mapping[key].type !== 'string') continue;
                if (!item[key].trim()) continue;
                mappedItem[mapping[key].label] = item[key];
            }
            mappedItem.images = extractImageData(item.images);
            mappedItem.categories = item.categories;
            fs.writeFileSync(path.join(root, 'output', 'mapped-models', `${id}-mapped.json`), JSON.stringify(mappedItem, null, 2));
            models.push(mappedItem);

        }
        fs.writeFileSync(path.join(root, 'output', 'mapped-models', 'mapped-models.json'), JSON.stringify(models, null, 2));

        // Save the report
        fs.writeFileSync(path.join(root, 'output', 'reports', 'fetch-report.json'), JSON.stringify(report, null, 2));
        console.log('Data fetching and processing completed.');
        // Save Analytics
        for (let key in analytics) {
            fs.writeFileSync(path.join(
                root, 'output', 'analytics', `analytics-${key}.json`), 
                JSON.stringify(Array.from(analytics[key]), null, 2));
        }
    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

fetchModels();
