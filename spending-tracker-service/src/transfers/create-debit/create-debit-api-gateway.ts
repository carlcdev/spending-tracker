import { validate as uuidValidate } from 'uuid';
import { logger, initLogger } from '@packages/logger';
import { BadRequest, apiGatewayErrorTransformer } from '@packages/errors';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda';
import { createDebitHandler } from './create-debit';

export async function createDebitApiGateway(
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> {
  try {
    initLogger('payments-service.create-debit');

    const idempotencyKey = event.headers['Idempotency-Key'];
    const { accountId } = event.pathParameters;
    const body = JSON.parse(event.body);

    // Some very basic request validation, update to JSON schema, perhaps strict validation including max transfer size etc
    if (!body) {
      throw new BadRequest('a request body is required');
    }

    const { value, transactionId } = body;

    if (typeof value !== 'number') {
      throw new BadRequest('value must be a number');
    }

    if (!idempotencyKey) {
      throw new BadRequest('idempotencyKey is required');
    }

    if (!uuidValidate(transactionId)) {
      throw new BadRequest('transactionId must be a valid uuid');
    }

    const payload = {
      correlationId: event.requestContext.requestId,
      accountId,
      transactionId,
      idempotencyKey,
      value,
    };

    const transfer = await createDebitHandler(payload);

    return {
      statusCode: 201,
      body: JSON.stringify(transfer),
    };
  } catch (error) {
    logger.error(error.message, error);

    return apiGatewayErrorTransformer(error);
  }
}
