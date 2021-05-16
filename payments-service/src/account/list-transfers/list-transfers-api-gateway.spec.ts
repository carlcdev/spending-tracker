/* eslint-disable @typescript-eslint/no-explicit-any */

/*
Using any so I don't have to mock the whole lambda event.
In the real world you should use a full mocked event
*/

import { listTransfersApiGateway } from './list-transfers-api-gateway';
import { listTransfersHandler } from './list-transfers';

const mockedListTransfersHandler = <jest.Mock>listTransfersHandler;

jest.mock('./list-transfers');

const mockEvent: any = {
  requestContext: {
    requestId: 'uuid',
  },
  pathParameters: {
    accountId: 'accountId',
  },
};

describe('list-transfers-api-gateway', () => {
  describe('a successful request is made', () => {
    it('should call listTransfersHandler with the correlationId and account id', async () => {
      await listTransfersApiGateway(mockEvent);

      expect(listTransfersHandler).toBeCalledWith({
        correlationId: 'uuid',
        accountId: 'accountId',
      });
    });

    it('should return a 200 with the account', async () => {
      mockedListTransfersHandler.mockResolvedValueOnce([
        {
          id: 'debit-transfer-id',
          accountId: 'account-id',
          type: 'DEBIT',
          created: '2021-01-01T00:00:00Z',
          value: 100,
        },
      ]);

      const result = await listTransfersApiGateway(mockEvent);

      expect(result).toEqual({
        statusCode: 200,
        body: JSON.stringify([
          {
            id: 'debit-transfer-id',
            accountId: 'account-id',
            type: 'DEBIT',
            created: '2021-01-01T00:00:00Z',
            value: 100,
          },
        ]),
      });
    });
  });
});
