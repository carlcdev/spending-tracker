import { logger } from '@packages/logger';
import { NotFound } from '@packages/errors';
import { Account, getAccountById } from '../account-service';

export interface GetAccount {
  correlationId: string;
  accountId: string;
}

export async function getAccountHandler({
  accountId,
  correlationId,
}: GetAccount): Promise<Account> {
  logger.info('fetching account', {
    correlationId,
    accountId,
  });

  const accountExists = await getAccountById(accountId);

  if (!accountExists) {
    throw new NotFound('Account not found');
  }

  logger.info('account found', {
    correlationId,
    accountId,
  });

  return accountExists;
}
