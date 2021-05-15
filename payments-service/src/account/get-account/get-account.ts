import { logger } from '@packages/logger';
import { APIGatewayProxyResult } from 'aws-lambda';

interface GetAccountEvent {
  pathParameters: {
    accountId: string;
  };
}

export async function getAccount(
  event: GetAccountEvent
): Promise<APIGatewayProxyResult> {
  const { accountId } = event.pathParameters;

  logger.info('getting account details', {
    accountId,
  });

  return {
    statusCode: 200,
    body: JSON.stringify({ test: 'test' }),
  };
}
