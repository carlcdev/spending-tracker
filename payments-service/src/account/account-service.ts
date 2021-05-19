import { logger } from '@packages/logger';
import * as AWS from 'aws-sdk';
export interface Account {
  id: string;
  balance: number;
}

function getDynamoEndpoint() {
  if (process.env.STAGE === 'local') {
    // TODO: get from config
    logger.info(
      'running locally, configuring AWS.DynamoDB to point to localstack'
    );

    return 'http://localhost:4566';
  }

  return undefined;
}

const dynamo = new AWS.DynamoDB.DocumentClient({
  endpoint: getDynamoEndpoint(),
});

export async function getAccountById(id: string): Promise<Account> {
  const account = await dynamo
    .query({
      TableName: 'local-accounts', // TODO: get from config
      KeyConditionExpression: '#id = :id',
      ExpressionAttributeNames: {
        '#id': 'id',
      },
      ExpressionAttributeValues: {
        ':id': id,
      },
    })
    .promise();

  const items = account.Items as Account[];

  return items && items[0];
}

export async function createAccount(id: string): Promise<Account> {
  const accountToCreate: Account = {
    id,
    balance: 0,
  };

  await dynamo
    .put({
      TableName: 'local-accounts', // TODO: get from config
      Item: accountToCreate,
      ConditionExpression: 'attribute_not_exists(id)',
    })
    .promise();

  return accountToCreate;
}
