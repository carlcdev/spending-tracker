import { NotFound } from '@packages/errors';
import { createCreditHandler, CreateCredit } from './create-credit';
import { getAccountById } from '../../account/account-service';
import { creditAccount } from '../transfers-service';

jest.mock('../../account/account-service');
jest.mock('../transfers-service');

const mockGetAccountById = <jest.Mock>getAccountById;
const mockCreditAccount = <jest.Mock>creditAccount;

const mockPayload: CreateCredit = {
  correlationId: 'correlationId',
  transactionId: 'transactionId',
  accountId: 'accountId',
  idempotencyKey: 'idempotencyKey',
  value: 100,
};

describe('create-credit', () => {
  describe('when the account does not exist', () => {
    it('should throw a not found error', async () => {
      mockGetAccountById.mockResolvedValueOnce(undefined);

      const expectedError = new NotFound('Account not found');

      await expect(createCreditHandler(mockPayload)).rejects.toThrowError(
        expectedError
      );
    });
  });

  describe('when the account does exist', () => {
    it('should call creditAccount', async () => {
      mockGetAccountById.mockResolvedValueOnce({
        id: 'accountId',
        balance: 100,
      });
      mockCreditAccount.mockResolvedValueOnce({
        id: 'credit-id',
        accountId: 'account-id',
        type: 'CREDIT',
        created: '2021-01-01T00:00:00Z',
        value: 100,
      });

      const result = await createCreditHandler(mockPayload);

      expect(result).toEqual({
        id: 'credit-id',
        accountId: 'account-id',
        type: 'CREDIT',
        created: '2021-01-01T00:00:00Z',
        value: 100,
      });
    });
  });
});
