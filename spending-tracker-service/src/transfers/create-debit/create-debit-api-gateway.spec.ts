/* eslint-disable @typescript-eslint/no-explicit-any */

/*
Using any so I don't have to mock the whole lambda event.
In the real world you should use a full mocked event
*/

import { createDebitApiGateway } from './create-debit-api-gateway';
import { createDebitHandler } from './create-debit';

const mockedCreateDebitHandler = <jest.Mock>createDebitHandler;

jest.mock('./create-debit');

let mockEvent: any;

describe('create-debit-api-gateway', () => {
  beforeEach(() => {
    mockEvent = {
      requestContext: {
        requestId: 'correlationId',
      },
      headers: {
        'Idempotency-Key': 'idempotencyKey',
      },
      pathParameters: {
        accountId: 'accountId',
      },
      body: JSON.stringify({
        transactionId: '612397cd-314c-434e-b34a-943fcae13bf3',
        value: 100,
      }),
    };
  });

  describe('when an unsuccessful request is made', () => {
    describe('when no body is provided is not a number', () => {
      it('should return a 400 error', async () => {
        mockEvent.body = null;

        const result = await createDebitApiGateway(mockEvent);

        expect(result).toEqual({
          statusCode: 400,
          body: JSON.stringify('a request body is required'),
        });
      });
    });

    describe('when no the value provided is not a number', () => {
      it('should return a 400 error', async () => {
        mockEvent.body = JSON.stringify({
          value: 'not-valid',
        });

        const result = await createDebitApiGateway(mockEvent);

        expect(result).toEqual({
          statusCode: 400,
          body: JSON.stringify('value must be a number'),
        });
      });
    });

    describe('when no idempotencyKey is provided', () => {
      it('should return a 400 error', async () => {
        delete mockEvent.headers['Idempotency-Key'];

        const result = await createDebitApiGateway(mockEvent);

        expect(result).toEqual({
          statusCode: 400,
          body: JSON.stringify('idempotencyKey is required'),
        });
      });
    });

    describe('when the transactionId is invalid', () => {
      it('should return a 400 when the transactionId is undefined', async () => {
        mockEvent.body = JSON.stringify({
          transactionId: undefined,
          value: 100,
        });

        const result = await createDebitApiGateway(mockEvent);

        expect(result).toEqual({
          statusCode: 400,
          body: JSON.stringify('transactionId must be a valid uuid'),
        });
      });

      it('should return a 400 when the transactionId is not a uuid', async () => {
        mockEvent.body = JSON.stringify({
          transactionId: 'not-a-uuid',
          value: 100,
        });

        const result = await createDebitApiGateway(mockEvent);

        expect(result).toEqual({
          statusCode: 400,
          body: JSON.stringify('transactionId must be a valid uuid'),
        });
      });
    });
  });

  describe('when a successful request is made', () => {
    it('should call createDebitHandler with the correlationId, accountId, idempotencyKey, transactionId and value', async () => {
      await createDebitApiGateway(mockEvent);

      expect(createDebitHandler).toBeCalledWith({
        transactionId: '612397cd-314c-434e-b34a-943fcae13bf3',
        correlationId: 'correlationId',
        accountId: 'accountId',
        idempotencyKey: 'idempotencyKey',
        value: 100,
      });
    });

    it('should return a 201 with the debit transfer record', async () => {
      mockedCreateDebitHandler.mockResolvedValueOnce({
        id: '612397cd-314c-434e-b34a-943fcae13bf3',
        accountId: 'account-id',
        type: 'DEBIT',
        created: '2021-01-01T00:00:00Z',
        value: 100,
      });

      const result = await createDebitApiGateway(mockEvent);

      expect(result).toEqual({
        statusCode: 201,
        body: JSON.stringify({
          id: '612397cd-314c-434e-b34a-943fcae13bf3',
          accountId: 'account-id',
          type: 'DEBIT',
          created: '2021-01-01T00:00:00Z',
          value: 100,
        }),
      });
    });
  });
});
