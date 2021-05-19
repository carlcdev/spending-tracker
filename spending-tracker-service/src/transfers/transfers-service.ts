import { v4 as uuid } from 'uuid';
import * as AWS from 'aws-sdk';
import { config } from '../config/config';
import { getDynamoEndpoint } from '../utils/get-dynamo-endpoint';

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
            TableName: config.transfersTableName,
            Item: creditRecord,
            ConditionExpression: 'attribute_not_exists(id)',
          },
        },
        {
          Update: {
            TableName: config.accountsTableName,
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
            TableName: config.transfersTableName,
            Item: debitRecord,
            ConditionExpression: 'attribute_not_exists(id)',
          },
        },
        {
          Update: {
            TableName: config.accountsTableName,
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
      TableName: config.transfersTableName,
      IndexName: `${config.transfersTableName}-gsi-1`,
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
