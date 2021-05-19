import React from 'react';
import { render, screen } from '../config/test-utils';
import { AccountCard } from './AccountCard';

function NoAccSelectedComponent() {
  return <p>No account selected</p>;
}

describe('AccountCard', () => {
  describe('when no account is selected', () => {
    it('should show the no account selected component', () => {
      render(
        <AccountCard noAccountSelectedComponent={<NoAccSelectedComponent />} />
      );

      const noAccountText = screen.getByText(/No account selected/i);

      expect(noAccountText).toBeInTheDocument();
    });
  });

  describe('when an account has been selected', () => {
    it('should show the balance in GBP format', () => {
      const account = {
        balance: 12000,
        accountNumber: '12345678',
      };

      render(
        <AccountCard
          account={account}
          noAccountSelectedComponent={<NoAccSelectedComponent />}
        />
      );

      const balance = screen.getByText(/£12,000.00/i);

      expect(balance).toBeInTheDocument();
    });

    it('should show the account number', () => {
      const account = {
        balance: 12000,
        accountNumber: '12345678',
      };

      render(
        <AccountCard
          account={account}
          noAccountSelectedComponent={<NoAccSelectedComponent />}
        />
      );

      const balance = screen.getByText(/12345678/i);

      expect(balance).toBeInTheDocument();
    });
  });

  describe('when the account card is in a loading state', () => {
    it('should show the loading spinner', () => {
      render(
        <AccountCard
          loading
          noAccountSelectedComponent={<NoAccSelectedComponent />}
        />
      );

      const noAccountText = screen.queryByText(/No account selected/i);
      const loadingSpinner = screen.getByLabelText(/loading/i);

      expect(noAccountText).not.toBeInTheDocument();
      expect(loadingSpinner).toBeInTheDocument();
    });
  });
});
