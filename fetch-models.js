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

const root = cwd();

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
        for (let id of ids.modelitems) {
            const itemsResponse = await fetch(`${config.baseUrl}/${config.itemsPath}/${id}`);
            if (!itemsResponse.ok) {
                report.error.push(id);
                continue;
            }
            report.success.push(id);
            const item = await itemsResponse.json();

            // Save each model item
            fs.writeFileSync(path.join(root, 'output', 'models', `${id}.json`), JSON.stringify(item, null, 2));
            // Map each model item and save it
            let mappedItem = {};
            for (let key in mapping) {
                if (mapping[key].ignore) continue;
                if (mapping[key].type !== 'string') continue;
                if (!item[key].trim()) continue;
                mappedItem[key] = item[mapping[key].label];
            }
            fs.writeFileSync(path.join(root, 'output', 'mapped-models', `${id}-mapped.json`), JSON.stringify(mappedItem, null, 2));
        }

        // Save the report
        fs.writeFileSync(path.join(root, 'output', 'reports', 'fetch-report.json'), JSON.stringify(report, null, 2));
        console.log('Data fetching and processing completed.');

    } catch (error) {
        console.error('Error fetching data:', error);
    }
}

fetchModels();
