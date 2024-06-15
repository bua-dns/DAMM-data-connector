# Fetching DAMM Data and Mapping It for Reuse

## Status

This is a work in progress in an early stage - not yet ready for production use!

## Goals

The goal of this toolset is to prepare data about mathematical models from [mathematical-models.org](https://mathematical-models.org/) for reuse.

## Data Source

Endpoint for fetching information about the collections holding mathematical models:
- [Collections API](https://mathematical-models.org/api/collections/)

Endpoint for fetching a single item:
- [Models API](https://mathematical-models.org/api/models/)

Since it is not possible to fetch all items of a collection at once, the script first fetches the collection information and extracts the item IDs for that collection. In a second step, the items are fetched one at a time.

## Usage

To use this toolset, follow these steps:

1. **Download or fork the repository and install dependencies:**

    ```bash
    npm install
    ```

2. **Fetch and analyze the data:**

    ```bash
    node fetch-models.js
    ```

3. **Output:**

    - Downloaded model items are saved in the `/output/models` directory.
    - A report detailing successful and unsuccessful fetches is saved in `/output/reports/fetch-report.json`.

## Prerequisites

This toolset has been tested with Node.js version 20.9.0 or higher.
