import { BadRequest, NotFound } from '@packages/errors';
import { createDebitHandler, CreateDebit } from './create-debit';
import { getAccountById } from '../../account/account-service';
import { debitAccount } from '../transfers-service';

jest.mock('../../account/account-service');
jest.mock('../transfers-service');

const mockGetAccountById = <jest.Mock>getAccountById;
const mockDebitAccount = <jest.Mock>debitAccount;

const mockPayload: CreateDebit = {
  correlationId: 'uuid',
  accountId: 'accountId',
  idempotencyKey: 'idempotencyKey',
  value: 100,
};

describe('create-debit', () => {
  describe('when the account does not exist', () => {
    it('should throw a not found error', async () => {
      mockGetAccountById.mockResolvedValueOnce(undefined);

      const expectedError = new NotFound('Account not found');

      await expect(createDebitHandler(mockPayload)).rejects.toThrowError(
        expectedError
      );
    });
  });

  describe('when the account does exist', () => {
    describe('when the account has enough money', () => {
      it('should call debitAccount', async () => {
        mockGetAccountById.mockResolvedValueOnce({
          id: 'accountId',
          balance: 100,
        });
        mockDebitAccount.mockResolvedValueOnce({
          id: 'debit-id',
          accountId: 'account-id',
          type: 'DEBIT',
          created: '2021-01-01T00:00:00Z',
          value: 100,
        });

        const result = await createDebitHandler(mockPayload);

        expect(result).toEqual({
          id: 'debit-id',
          accountId: 'account-id',
          type: 'DEBIT',
          created: '2021-01-01T00:00:00Z',
          value: 100,
        });
      });
    });

    describe('when the account does not have enough money', () => {
      it('should throw a BadRequest ', async () => {
        mockGetAccountById.mockResolvedValueOnce({
          id: 'accountId',
          balance: 99,
        });
        mockDebitAccount.mockResolvedValueOnce({
          id: 'debit-id',
          accountId: 'account-id',
          type: 'DEBIT',
          created: '2021-01-01T00:00:00Z',
          value: 100,
        });

        const expectedError = new BadRequest(
          'The balance is too low to process this transaction'
        );

        await expect(createDebitHandler(mockPayload)).rejects.toThrowError(
          expectedError
        );
      });
    });
  });
});
