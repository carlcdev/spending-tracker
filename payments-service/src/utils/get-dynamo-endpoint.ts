import { logger } from '@packages/logger';

export function getDynamoEndpoint(): string | undefined {
  if (process.env.STAGE === 'local') {
    logger.info(
      'running locally, configuring AWS.DynamoDB to point to localstack'
    );

    return 'http://localhost:4566';
  }

  return undefined;
}
