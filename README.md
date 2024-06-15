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
