import { v4 as uuid } from 'uuid';
import { logger } from '@packages/logger';
import * as AWS from 'aws-sdk';

export enum TransferType {
  DEBIT = 'DEBIT',
  CREDIT = 'CREDIT',
}

export interface Account {
  id: string;
  balance: number;
}

export interface Transfer {
  id: string;
  accountIdFrom: string;
  type: TransferType;
  created: string;
  value: number;
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

export async function creditAccount(
  accountId: string,
  value: number,
  idempotencyKey: string
): Promise<Transfer> {
  const creditRecord: Transfer = {
    id: uuid(),
    accountIdFrom: accountId,
    type: TransferType.CREDIT,
    created: new Date().toISOString(),
    value,
  };

  await dynamo
    .transactWrite({
      TransactItems: [
        {
          Put: {
            TableName: 'local-transfers', // TODO: get from config
            Item: creditRecord,
            ConditionExpression: 'attribute_not_exists(id)',
          },
        },
        {
          Update: {
            TableName: 'local-accounts',
            Key: { id: accountId },
            UpdateExpression: 'set #balance = #balance + :creditValue',
            ExpressionAttributeNames: { '#balance': 'balance' },
            ExpressionAttributeValues: {
              ':creditValue': value,
            },
          },
        },
      ],
      ClientRequestToken: idempotencyKey,
    })
    .promise();

  return creditRecord;
}

export async function debitAccount(
  accountId: string,
  value: number,
  idempotencyKey: string
): Promise<Transfer> {
  const debitRecord: Transfer = {
    id: uuid(),
    accountIdFrom: accountId,
    type: TransferType.DEBIT,
    created: new Date().toISOString(),
    value,
  };

  await dynamo
    .transactWrite({
      TransactItems: [
        {
          Put: {
            TableName: 'local-transfers', // TODO: get from config
            Item: debitRecord,
            ConditionExpression: 'attribute_not_exists(id)',
          },
        },
        {
          Update: {
            TableName: 'local-accounts',
            Key: { id: accountId },
            UpdateExpression: 'set #balance = #balance - :debitValue',
            ConditionExpression: '#balance > :min',
            ExpressionAttributeNames: { '#balance': 'balance' },
            ExpressionAttributeValues: {
              ':debitValue': value,
              ':min': 0,
            },
          },
        },
      ],
      ClientRequestToken: idempotencyKey,
    })
    .promise();

  return debitRecord;
}
