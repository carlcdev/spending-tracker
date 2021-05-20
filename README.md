# Spending Tracker

A simple spending tracker, using Serverless, Node, TypeScript, Lerna and DynamoDB.

## Prerequisites

- Node >= `14.17.0` was used to create this demo, although it may work in earlier versions, it has not been tested.
- Docker

## Architecture

A visual representation of the solution:

![image architecture](./docs/spending-tracker-architecture.png)

## API documentation

The API is documented using the OpenAPI specification. To view/edit the docs, copy the contents of the [spending-tracker-service.yaml](./docs/spending-tracker-service.yml) into the [Swagger Editor](https://editor.swagger.io/)

There is also a [postman collection](./docs/spending-tracker.postman_collection-.json) available.

## Installation

Clone the repo and run `npm i` in your terminal from the root directory.

## Running locally

### Run the environment
Run `npm run environment` in your terminal to start localstack, only used for DynamoDB in this example. It can take a few minutes to pull the localstack image from the Docker repository on first run.

> Docker must be installed and running

### Deploy the API locally
Ensure the environment is running in docker and type `npm run deploy:local` in your terminal to deploy the API cloudformation to localstack.

### Run the API and Client
Run `npm run start` in your terminal to start the API and client.

> Ensure the environment is running and deployed by following the steps above

## Unit tests
To run all of the tests in the monorepo run `npm run test` from the root dir.

Alternatively you can cd into the relevant project and type `npm run test` in your terminal to run the unit tests

## Deploy the API to AWS

Run `npm run deploy` to provision / update the API in AWS
