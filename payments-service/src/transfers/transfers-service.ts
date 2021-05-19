import { v4 as uuid } from 'uuid';
import { logger } from '@packages/logger';
import * as AWS from 'aws-sdk';

export enum TransferType {
  DEBIT = 'DEBIT',
  CREDIT = 'CREDIT',
}

export interface Transfer {
  id: string;
  accountId: string;
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

export async function creditAccount(
  accountId: string,
  value: number,
  idempotencyKey: string
): Promise<Transfer> {
  const creditRecord: Transfer = {
    id: uuid(),
    accountId,
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
    accountId,
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

export async function listTransfers(accountId: string): Promise<Transfer[]> {
  const transfers = await dynamo
    .query({
      TableName: 'local-transfers', // TODO: get from config
      IndexName: 'local-transfers-gsi-1',
      KeyConditionExpression: 'accountId = :accountId',
      ExpressionAttributeValues: {
        ':accountId': accountId,
      },
      ScanIndexForward: false,
    })
    .promise();

  const items = transfers.Items as Transfer[];

  return items;
}
