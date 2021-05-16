import { logger, initLogger } from '@packages/logger';
import { apiGatewayErrorTransformer } from '@packages/errors';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { getAccountHandler } from './get-account';

export async function getAccountApiGateway(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    initLogger('payments-service.get-account');

    const { accountId } = event.pathParameters;

    const payload = {
      correlationId: event.requestContext.requestId,
      accountId,
    };

    const account = await getAccountHandler(payload);

    return {
      statusCode: 200,
      body: JSON.stringify(account),
    };
  } catch (error) {
    logger.error(error.message, error);

    return apiGatewayErrorTransformer(error);
  }
}
