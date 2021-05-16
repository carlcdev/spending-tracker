import { NotFound } from '@packages/errors';
import { getAccountHandler, GetAccount } from './get-account';
import { getAccountById } from '../account-service';

jest.mock('../account-service');

const mockGetAccountById = <jest.Mock>getAccountById;

const mockPayload: GetAccount = {
  correlationId: 'uuid',
  accountId: 'accountId',
};

describe('get-account', () => {
  describe('when the account does not exist', () => {
    it('should throw a not found error', async () => {
      mockGetAccountById.mockResolvedValueOnce(undefined);

      const expectedError = new NotFound('Account not found');

      await expect(getAccountHandler(mockPayload)).rejects.toThrowError(
        expectedError
      );
    });
  });

  describe('when the account does exist', () => {
    it('should return the account', async () => {
      mockGetAccountById.mockResolvedValueOnce({
        id: 'accountId',
        balance: 100,
      });

      const result = await getAccountHandler(mockPayload);

      expect(result).toEqual({
        id: 'accountId',
        balance: 100,
      });
    });
  });
});
