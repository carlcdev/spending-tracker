import { logger, initLogger } from '@packages/logger';
import { BadRequest, apiGatewayErrorTransformer } from '@packages/errors';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { createCreditHandler } from './create-credit';

export async function createCreditApiGateway(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    initLogger('payments-service.create-transfer');

    const idempotencyKey = event.headers['Idempotency-Key'];
    const { accountId } = event.pathParameters;
    const body = JSON.parse(event.body);

    // Some very basic request validation, update to JSON schema, perhaps strict validation including max transfer size etc
    if (!body) {
      throw new BadRequest('a request body is required');
    }

    const { value } = body;

    if (typeof value !== 'number') {
      throw new BadRequest('value must be a number');
    }

    if (!idempotencyKey) {
      throw new BadRequest('idempotencyKey is required');
    }

    const payload = {
      correlationId: event.requestContext.requestId,
      accountId,
      idempotencyKey,
      value,
    };

    const transfer = await createCreditHandler(payload);

    return {
      statusCode: 201,
      body: JSON.stringify(transfer),
    };
  } catch (error) {
    logger.error(error.message, error);

    return apiGatewayErrorTransformer(error);
  }
}
