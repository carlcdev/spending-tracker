import { APIGatewayProxyResult } from 'aws-lambda';
import { CustomError } from '../';

export function apiGatewayErrorTransformer(
  error: CustomError
): APIGatewayProxyResult {
  switch (error.name) {
    case 'BadRequest':
      return {
        statusCode: 400,
        body: JSON.stringify(error.message),
      };
    case 'NotFound':
      return {
        statusCode: 404,
        body: JSON.stringify(error.message),
      };
    case 'Conflict':
      return {
        statusCode: 409,
        body: JSON.stringify(error.message),
      };
    case 'AppError':
    default:
      return {
        statusCode: 500,
        body: JSON.stringify('An error occurred'),
      };
  }
}
