import { logger } from '@packages/logger';
import { BadRequest, NotFound } from '@packages/errors';
import { getAccountById } from '../../account/account-service';
import { Transfer, debitAccount } from '../transfers-service';

export interface CreateDebit {
  correlationId: string;
  accountId: string;
  transactionId: string;
  idempotencyKey: string;
  value: number;
}

export async function createDebitHandler({
  correlationId,
  accountId,
  idempotencyKey,
  transactionId,
  value,
}: CreateDebit): Promise<Transfer> {
  const loggerContext = {
    correlationId,
    idempotencyKey,
  };

  logger.info('checking if account exists', {
    ...loggerContext,
    accountId,
  });

  const account = await getAccountById(accountId);

  if (!account) {
    throw new NotFound('Account not found');
  }

  if (account.balance - value < 0) {
    throw new BadRequest('The balance is too low to process this transaction');
  }

  logger.info('creating debit transfer record', {
    ...loggerContext,
    accountId,
    value,
  });

  return debitAccount(transactionId, accountId, value, idempotencyKey);
}
