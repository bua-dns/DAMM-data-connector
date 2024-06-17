# Fetching DAMM Data and Mapping It for Reuse

## Status

**Work in Progress**: This project is in its early stages and is not yet ready for production use.

## Goals

The objective of this toolset is to prepare data about mathematical models from [mathematical-models.org](https://mathematical-models.org/) for reuse.

## Data Source

Endpoints for fetching data:

- **Collections API**: [Collections API](https://mathematical-models.org/api/collections/)
- **Models API**: [Models API](https://mathematical-models.org/api/models/)

Since fetching all items of a collection at once is not possible, the script initially fetches the collection information to extract the item IDs. Subsequently, the items are fetched individually.

## Configuration

Endpoints of the data source and the specific collection to be fetched and mapped are configured in `/config/project.js`.

## Mapping

The mapping schema is specified in the `/config/mapping.js` file. This schema defines how each field type should be processed and transformed.

## Usage

To use this toolset, follow these steps:

1. **Clone the repository and install dependencies:**

    ```bash
    git clone https://github.com/bua-dns/DAMM-data-connector .
    cd DAMM-data-connector
    npm install
    ```

2. **Fetch and analyze the data:**

    ```bash
    node fetch-models.js
    ```

3. **Output:**

    - Downloaded model items are saved in the `/output/models` directory.
    - Mapped model items are saved in the `/output/mapped-models` directory. The `mapped-models.json` file contains an array of all mapped items.
    - A report detailing successful and unsuccessful fetches is saved in `/output/reports/fetch-report.json`.

## Prerequisites

This toolset has been tested with Node.js version 20.9.0 or higher.
