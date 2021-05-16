import { Conflict } from '@packages/errors';
import { createAccountHandler, CreateAccount } from './create-account';
import { getAccountById, createAccount } from '../account-service';

jest.mock('../account-service');

const mockGetAccountById = <jest.Mock>getAccountById;
const mockCreateAccount = <jest.Mock>createAccount;

const mockPayload: CreateAccount = {
  correlationId: 'uuid',
};

describe('create-account', () => {
  describe('when the account already exists', () => {
    it('should throw a conflict error', async () => {
      mockGetAccountById.mockResolvedValueOnce({
        id: 'test',
        balance: 100,
      });

      const expectedError = new Conflict('Account already exists');

      await expect(createAccountHandler(mockPayload)).rejects.toThrowError(
        expectedError
      );
    });
  });

  describe('when the account does not exist', () => {
    it('should create the account', async () => {
      mockGetAccountById.mockResolvedValueOnce(undefined);
      mockCreateAccount.mockResolvedValueOnce({
        id: 'accountId',
        balance: 0,
      });

      const result = await createAccountHandler(mockPayload);

      expect(result).toEqual({
        id: 'accountId',
        balance: 0,
      });
    });
  });
});
