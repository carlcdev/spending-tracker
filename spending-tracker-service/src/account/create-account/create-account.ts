import { logger } from '@packages/logger';
import { Conflict } from '@packages/errors';
import { Account, createAccount, getAccountById } from '../account-service';

export interface CreateAccount {
  correlationId: string;
}

export async function createAccountHandler({
  correlationId,
}: CreateAccount): Promise<Account> {
  // Hard coded accountId, in the real world would be passed with the event
  const accountId = '12345678';

  logger.info('checking if account exists', {
    correlationId,
    accountId,
  });

  const accountExists = await getAccountById(accountId);

  if (accountExists) {
    throw new Conflict('Account already exists');
  }

  logger.info('creating account', {
    correlationId,
    accountId,
  });

  return createAccount(accountId);
}
