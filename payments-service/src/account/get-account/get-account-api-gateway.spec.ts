/* eslint-disable @typescript-eslint/no-explicit-any */

/*
Using any so I don't have to mock the whole lambda event.
In the real world you should use a full mocked event
*/

import { getAccountApiGateway } from './get-account-api-gateway';
import { getAccountHandler } from './get-account';

const mockedGetAccountHandler = <jest.Mock>getAccountHandler;

jest.mock('./get-account');

const mockEvent: any = {
  requestContext: {
    requestId: 'uuid',
  },
  pathParameters: {
    accountId: 'accountId',
  },
};

describe('get-account-api-gateway', () => {
  describe('a successful request is made', () => {
    it('should call getAccount with the correlationId and account id', async () => {
      await getAccountApiGateway(mockEvent);

      expect(getAccountHandler).toBeCalledWith({
        correlationId: 'uuid',
        accountId: 'accountId',
      });
    });

    it('should return a 200 with the account', async () => {
      mockedGetAccountHandler.mockResolvedValueOnce({
        id: 'accountId',
        balance: 0,
      });

      const result = await getAccountApiGateway(mockEvent);

      expect(result).toEqual({
        statusCode: 200,
        body: JSON.stringify({
          id: 'accountId',
          balance: 0,
        }),
      });
    });
  });
});
