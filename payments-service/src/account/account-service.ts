import * as AWS from 'aws-sdk';
import { getDynamoEndpoint } from '../utils/get-dynamo-endpoint';
import { config } from '../config/config';
export interface Account {
  id: string;
  balance: number;
}

const dynamo = new AWS.DynamoDB.DocumentClient({
  endpoint: getDynamoEndpoint(),
});

export async function getAccountById(id: string): Promise<Account> {
  const account = await dynamo
    .query({
      TableName: config.accountsTableName,
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
      TableName: config.accountsTableName,
      Item: accountToCreate,
      ConditionExpression: 'attribute_not_exists(id)',
    })
    .promise();

  return accountToCreate;
}
