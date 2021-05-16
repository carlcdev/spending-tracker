/* eslint-disable @typescript-eslint/no-explicit-any */

/*
Using any so I don't have to mock the whole lambda event.
In the real world you should use a full mocked event
*/

import { createCreditApiGateway } from './create-credit-api-gateway';
import { createCreditHandler } from './create-credit';

const mockedCreateCreditHandler = <jest.Mock>createCreditHandler;

jest.mock('./create-credit');

let mockEvent: any;

describe('create-credit-api-gateway', () => {
  beforeEach(() => {
    mockEvent = {
      requestContext: {
        requestId: 'uuid',
      },
      headers: {
        'Idempotency-Key': 'idempotencyKey',
      },
      pathParameters: {
        accountId: 'accountId',
      },
      body: JSON.stringify({
        value: 100,
      }),
    };
  });

  describe('when an unsuccessful request is made', () => {
    describe('when no body is provided is not a number', () => {
      it('should return a 400 error', async () => {
        mockEvent.body = null;

        const result = await createCreditApiGateway(mockEvent);

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

        const result = await createCreditApiGateway(mockEvent);

        expect(result).toEqual({
          statusCode: 400,
          body: JSON.stringify('value must be a number'),
        });
      });
    });

    describe('when no idempotencyKey is provided', () => {
      it('should return a 400 error', async () => {
        delete mockEvent.headers['Idempotency-Key'];

        const result = await createCreditApiGateway(mockEvent);

        expect(result).toEqual({
          statusCode: 400,
          body: JSON.stringify('idempotencyKey is required'),
        });
      });
    });
  });

  describe('when a successful request is made', () => {
    it('should call createCreditHandler with the correlationId, account id, idempotencyKey and value', async () => {
      await createCreditApiGateway(mockEvent);

      expect(createCreditHandler).toBeCalledWith({
        correlationId: 'uuid',
        accountId: 'accountId',
        idempotencyKey: 'idempotencyKey',
        value: 100,
      });
    });

    it('should return a 201 with the credit transfer record', async () => {
      mockedCreateCreditHandler.mockResolvedValueOnce({
        id: 'credit-transfer-id',
        accountId: 'account-id',
        type: 'CREDIT',
        created: '2021-01-01T00:00:00Z',
        value: 100,
      });

      const result = await createCreditApiGateway(mockEvent);

      expect(result).toEqual({
        statusCode: 201,
        body: JSON.stringify({
          id: 'credit-transfer-id',
          accountId: 'account-id',
          type: 'CREDIT',
          created: '2021-01-01T00:00:00Z',
          value: 100,
        }),
      });
    });
  });
});
