import React from 'react';
import MockDate from 'mockdate';
import { render, screen } from '../config/test-utils';
import { TransfersList } from './TransfersList';

describe('TransfersList', () => {
  beforeEach(() => {
    MockDate.set('1980-01-01T13:00:00Z');
  });

  afterEach(() => {
    MockDate.reset();
  });

  it('should show the table headings', () => {
    render(<TransfersList />);

    const amountHeading = screen.getByText('Amount (£)');
    const typeHeading = screen.getByText('Type');
    const dateHeading = screen.getByText('Date');

    expect(amountHeading).toBeInTheDocument();
    expect(typeHeading).toBeInTheDocument();
    expect(dateHeading).toBeInTheDocument();
  });

  describe('when no transfers exist', () => {
    it('should show the no transfers message', () => {
      render(<TransfersList transfers={[]} />);

      const noTransfersMessage = screen.getByText('No transfers found');

      expect(noTransfersMessage).toBeInTheDocument();
    });
  });

  describe('when transfers exist', () => {
    it('should list the transfers', () => {
      render(
        <TransfersList
          transfers={[
            {
              accountId: 'accountId',
              created: new Date().toISOString(),
              id: 'transferId1',
              type: 'CREDIT',
              value: 100,
            },
            {
              accountId: 'accountId',
              created: new Date().toISOString(),
              id: 'transferId2',
              type: 'DEBIT',
              value: 2000,
            },
          ]}
        />
      );

      const creditTransferType = screen.getByText('CREDIT');
      const debitTransferType = screen.getByText('DEBIT');

      expect(creditTransferType).toBeInTheDocument();
      expect(debitTransferType).toBeInTheDocument();
    });

    it('should convert the amount into the GBP format', () => {
      render(
        <TransfersList
          transfers={[
            {
              accountId: 'accountId',
              created: new Date().toISOString(),
              id: 'transferId1',
              type: 'CREDIT',
              value: 1123456,
            },
          ]}
        />
      );

      const readableAmount = screen.getByText('£1,123,456.00');

      expect(readableAmount).toBeInTheDocument();
    });

    it('should convert the date into the readable format', () => {
      render(
        <TransfersList
          transfers={[
            {
              accountId: 'accountId',
              created: new Date().toISOString(),
              id: 'transferId1',
              type: 'CREDIT',
              value: 100,
            },
          ]}
        />
      );

      const readableDate = screen.getByText('1/1/80, 1:00:00 PM');

      expect(readableDate).toBeInTheDocument();
    });
  });
});
