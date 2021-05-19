import { logger, initLogger } from '@packages/logger';
import { apiGatewayErrorTransformer } from '@packages/errors';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { createAccountHandler } from './create-account';

export async function createAccountApiGateway(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    initLogger('payments-service.create-account');

    const payload = {
      correlationId: event.requestContext.requestId,
    };

    const account = await createAccountHandler(payload);

    return {
      statusCode: 201,
      body: JSON.stringify(account),
    };
  } catch (error) {
    logger.error(error.message, error);

    return apiGatewayErrorTransformer(error);
  }
}
