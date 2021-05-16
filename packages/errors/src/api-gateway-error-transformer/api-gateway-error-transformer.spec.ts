import { apiGatewayErrorTransformer } from './api-gateway-error-transformer';
import { AppError, BadRequest, Conflict, NotFound } from '../errors';

describe('api-gateway-error-transformer', () => {
  describe('when an unhandled error is passed', () => {
    it('should return a 500 hiding the internal error', () => {
      const result = apiGatewayErrorTransformer(
        new Error('An unhandled error message')
      );

      expect(result).toEqual({
        statusCode: 500,
        body: '"An error occurred"',
      });
    });
  });

  describe('when an AppError error is passed', () => {
    it('should return a 500 hiding the internal error', () => {
      const result = apiGatewayErrorTransformer(
        new AppError(
          "An internal error we wouldn't want to expose to a consumer"
        )
      );

      expect(result).toEqual({
        statusCode: 500,
        body: '"An error occurred"',
      });
    });
  });

  describe('when a NotFound error is passed', () => {
    it('should return a 404 with the error message', () => {
      const result = apiGatewayErrorTransformer(
        new NotFound('The resource was not found')
      );

      expect(result).toEqual({
        statusCode: 404,
        body: '"The resource was not found"',
      });
    });
  });

  describe('when a Conflict error is passed', () => {
    it('should return a 409 with the error message', () => {
      const result = apiGatewayErrorTransformer(
        new Conflict('The resource already exists')
      );

      expect(result).toEqual({
        statusCode: 409,
        body: '"The resource already exists"',
      });
    });
  });

  describe('when a BadRequest error is passed', () => {
    it('should return a 400 with the error message', () => {
      const result = apiGatewayErrorTransformer(
        new BadRequest('There was an error with the request')
      );

      expect(result).toEqual({
        statusCode: 400,
        body: '"There was an error with the request"',
      });
    });
  });
});
