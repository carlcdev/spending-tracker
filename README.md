# payments-service

A simple payments service, using Node, TypeScript and Lerna.

## Prerequisites

- Node >= `14.17.0` was used to create this demo, although it may work in earlier versions, it has not been tested.
- Docker

## Architecture

A visual representation of the solution:

![image architecture](./docs/architecture.png)

## API documentation

The API is documented using the OpenAPI specification. To view/edit the docs, copy the contents of the [payments-service.yaml](./docs/payments-service.yml) into the [Swagger Editor](https://editor.swagger.io/)

## Installation

Run `npm i` in your terminal

## Run the environment
Run `npm run environment` in your terminal to start DynamoDB.

## Run the Service

Run `npm run start` in your terminal to start the API and client.

## Unit tests

cd into the relevant project and type `npm run test` in your terminal to run the unit tests

## Code coverage

Run `npm run test:coverage` in your terminal. A `coverage` directory is generated in the root of the repository. To view the coverage, open the `index.html` file in that directory.

## Deploy the API

Run `npm run deploy` to provision / update the API in AWS

## Notes

Left comments in code as discussion points
