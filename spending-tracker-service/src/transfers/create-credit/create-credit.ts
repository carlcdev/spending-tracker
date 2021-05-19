import { logger } from '@packages/logger';
import { NotFound } from '@packages/errors';
import { getAccountById } from '../../account/account-service';
import { creditAccount, Transfer } from '../../transfers/transfers-service';

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

  logger.info('creating credit transfer record', {
    ...loggerContext,
    accountId,
    value,
  });

  return creditAccount(accountId, value, idempotencyKey);
}
