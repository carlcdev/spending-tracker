/* eslint-disable @typescript-eslint/no-explicit-any */

/*
Using any so I don't have to mock the whole lambda event.
In the real world you should use a full mocked event
*/

import { createAccountApiGateway } from './create-account-api-gateway';
import { createAccountHandler } from './create-account';

const mockedCreateAccountHandler = <jest.Mock>createAccountHandler;

jest.mock('./create-account');

const mockEvent: any = {
  requestContext: {
    requestId: 'uuid',
  },
};

describe('create-account-api-gateway', () => {
  describe('a successful request is made', () => {
    it('should call createAccount with the correlationId', async () => {
      await createAccountApiGateway(mockEvent);

      expect(createAccountHandler).toBeCalledWith({
        correlationId: 'uuid',
      });
    });

    it('should return a 201 with the created account', async () => {
      mockedCreateAccountHandler.mockResolvedValueOnce('created account');

      const result = await createAccountApiGateway(mockEvent);

      expect(result).toEqual({
        statusCode: 201,
        body: '"created account"',
      });
    });
  });
});
