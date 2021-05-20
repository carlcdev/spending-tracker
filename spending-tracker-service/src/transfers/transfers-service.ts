import * as AWS from 'aws-sdk';
import { AppError } from '@packages/errors';
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

async function handleIdempotencyFailure(
  transferRecord: Transfer
): Promise<Transfer> {
  const errorMessage = 'Transfer details dont match for idempotency id';
  const existingTransfer = await getTransferById(transferRecord.id);

  if (existingTransfer) {
    // If everything except the created date matches, this transaction is fine and can be treated as idempotent
    if (
      existingTransfer.id === transferRecord.id &&
      existingTransfer.accountId === transferRecord.accountId &&
      existingTransfer.type === transferRecord.type &&
      existingTransfer.value === transferRecord.value
    ) {
      return existingTransfer;
    }

    throw new AppError(errorMessage);
  }

  throw new AppError(errorMessage);
}

export async function creditAccount(
  transactionId: string,
  accountId: string,
  value: number,
  idempotencyKey: string
): Promise<Transfer> {
  const creditRecord: Transfer = {
    id: transactionId,
    accountId,
    type: TransferType.CREDIT,
    created: new Date().toISOString(),
    value,
  };

  try {
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
  } catch (error) {
    if (error.code === 'IdempotentParameterMismatchException') {
      return handleIdempotencyFailure(creditRecord);
    }

    throw error;
  }
}

export async function debitAccount(
  transactionId: string,
  accountId: string,
  value: number,
  idempotencyKey: string
): Promise<Transfer> {
  const debitRecord: Transfer = {
    id: transactionId,
    accountId,
    type: TransferType.DEBIT,
    created: new Date().toISOString(),
    value,
  };

  try {
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
  } catch (error) {
    if (error.code === 'IdempotentParameterMismatchException') {
      return handleIdempotencyFailure(debitRecord);
    }

    throw error;
  }
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

export async function getTransferById(id: string): Promise<Transfer> {
  const transfer = await dynamo
    .query({
      TableName: config.transfersTableName,
      KeyConditionExpression: '#id = :id',
      ExpressionAttributeNames: {
        '#id': 'id',
      },
      ExpressionAttributeValues: {
        ':id': id,
      },
    })
    .promise();

  const items = transfer.Items as Transfer[];

  return items && items[0];
}
