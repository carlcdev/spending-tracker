import { NotFound } from '@packages/errors';
import { listTransfersHandler, ListTransfers } from './list-transfers';
import { getAccountById, listTransfers } from '../account-service';

jest.mock('../account-service');

const mockGetAccountById = <jest.Mock>getAccountById;
const mockListTransfers = <jest.Mock>listTransfers;

const mockPayload: ListTransfers = {
  correlationId: 'uuid',
  accountId: 'accountId',
};

describe('list-transfers', () => {
  describe('when the account does not exist', () => {
    it('should throw a not found error', async () => {
      mockGetAccountById.mockResolvedValueOnce(undefined);

      const expectedError = new NotFound('Account not found');

      await expect(listTransfersHandler(mockPayload)).rejects.toThrowError(
        expectedError
      );
    });
  });

  describe('when the account does exist', () => {
    it('should return the transfers', async () => {
      mockGetAccountById.mockResolvedValueOnce({
        id: 'accountId',
        balance: 100,
      });
      mockListTransfers.mockResolvedValueOnce([
        {
          id: 'debit-transfer-id',
          accountId: 'account-id',
          type: 'DEBIT',
          created: '2021-01-01T00:00:00Z',
          value: 100,
        },
      ]);

      const result = await listTransfersHandler(mockPayload);

      expect(result).toEqual([
        {
          id: 'debit-transfer-id',
          accountId: 'account-id',
          type: 'DEBIT',
          created: '2021-01-01T00:00:00Z',
          value: 100,
        },
      ]);
    });
  });
});
