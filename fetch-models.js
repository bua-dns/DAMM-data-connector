/*
Holt die Daten zu den Modellen aus der HU Berlin aus dem DAMM Portal
*/

import fs from 'fs';
import path from 'path';
import { cwd } from 'process';

const root = cwd();

const collectionEndpoint = 'https://mathematical-models.org/api/collections/7';
const itemsEndpoint = 'https://mathematical-models.org/api/models/';

async function fetchModels() {
    try {
        let report = {
            success: [],
            error: []
        };
        const collectionResponse = await fetch(collectionEndpoint);
        const ids = await collectionResponse.json();
        for (let id of ids.modelitems) {
            const itemsResponse = await fetch(itemsEndpoint + id);
            if (!itemsResponse.ok) {
                report.error.push(id);
                continue;
            }
            report.success.push(id);
            const item = await itemsResponse.json();
            fs.writeFileSync(path.join(root, 'output', 'models', `${id}.json`), JSON.stringify(item, null, 2));
            fs.writeFileSync(path.join(root, 'output', 'reports', `fetch-report.json`), JSON.stringify(report, null, 2));

        }
        console.log('done');

    } catch (error) {
        console.error(error);
    }
}
fetchModels();