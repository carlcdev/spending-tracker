import { logger } from '@packages/logger';
import { NotFound } from '@packages/errors';
import { Transfer, creditAccount, getAccountById } from '../account-service';

export interface CreateCredit {
  correlationId: string;
  accountId: string;
  idempotencyKey: string;
  value: number;
}

export async function createCreditHandler({
  correlationId,
  accountId,
  idempotencyKey,
  value,
}: CreateCredit): Promise<Transfer> {
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

  // For this example, it doesn't matter if accountTo exists or not so no need to validate

  logger.info('creating credit transfer record', {
    ...loggerContext,
    accountId,
    value,
  });

  return creditAccount(accountId, value, idempotencyKey);
}
