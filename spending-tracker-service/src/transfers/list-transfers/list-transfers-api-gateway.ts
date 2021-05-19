import { logger, initLogger } from '@packages/logger';
import { apiGatewayErrorTransformer } from '@packages/errors';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { listTransfersHandler } from './list-transfers';

export async function listTransfersApiGateway(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    initLogger('payments-service.list-transfers');

    const { accountId } = event.pathParameters;

    const payload = {
      correlationId: event.requestContext.requestId,
      accountId,
    };

    const transfers = await listTransfersHandler(payload);

    return {
      statusCode: 200,
      body: JSON.stringify(transfers),
    };
  } catch (error) {
    logger.error(error.message, error);

    return apiGatewayErrorTransformer(error);
  }
}
