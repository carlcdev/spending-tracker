import { logger } from '@packages/logger';
import { NotFound } from '@packages/errors';
import { getAccountById, listTransfers, Transfer } from '../account-service';

export interface ListTransfers {
  correlationId: string;
  accountId: string;
}

export async function listTransfersHandler({
  accountId,
  correlationId,
}: ListTransfers): Promise<Transfer[]> {
  const loggerContext = {
    correlationId,
    accountId,
  };

  logger.info('fetching account', loggerContext);

  const accountExists = await getAccountById(accountId);

  if (!accountExists) {
    throw new NotFound('Account not found');
  }

  logger.info('account found', loggerContext);

  logger.info('fetching transfers', loggerContext);

  const transfers = await listTransfers(accountId);

  logger.info('transfers fetched', loggerContext);

  return transfers;
}
