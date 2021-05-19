import React from 'react';
import { render, screen, waitFor, fireEvent } from '../config/test-utils';
import { server, rest } from '../config/test-server';
import { API_URL } from '../config/config';
import { Account } from './Account';

describe('Account', () => {
  describe('when no account exists', () => {
    beforeEach(() => {
      server.use(
        rest.get(`${API_URL}/accounts/12345678`, async (req, res, ctx) => {
          return res(
            ctx.status(404),
            ctx.json({ message: 'Account not found' })
          );
        })
      );
    });

    it('should show create account message and button', async () => {
      render(<Account />);

      await waitFor(() => screen.getByText('No account found'));

      const createAccountButton = screen.getByText('Create account');

      expect(createAccountButton).toBeInTheDocument();
    });

    it('should create the account when "Create account" is clicked', async () => {
      render(<Account />);

      await waitFor(() => screen.getByText('No account found'));
      const createAccountButton = screen.getByText('Create account');

      fireEvent.click(createAccountButton);

      await waitFor(() => {
        const accountNumber = screen.getByText('12345678');
        const balance = screen.getByText('£0.00');

        expect(accountNumber).toBeInTheDocument();
        expect(balance).toBeInTheDocument();
      });
    });
  });

  describe('when the account exists', () => {
    describe('credit account', () => {
      it('should credit the account', async () => {
        render(<Account />);

        // Check account has loaded with default balance of 800
        await waitFor(() => screen.getByText('£800.00'));

        const amountInput = screen.getByLabelText('amount-input');
        const dropdown = screen.getByLabelText('Open Drop');

        // Select CREDIT dropdown item
        fireEvent.change(amountInput, { target: { value: 101 } });
        fireEvent.click(dropdown);
        const creditDropdownOpt = screen.getByText('CREDIT');
        fireEvent.click(creditDropdownOpt);

        // Hit the form create button
        const createButton = await waitFor(() => screen.getByText(/Create/i));
        fireEvent.click(createButton);

        await waitFor(() => {
          // 101 plus the default balance = 801
          const [balance] = screen.getAllByText('£901.00');

          expect(balance).toBeInTheDocument();
        });
      });
    });

    describe('debit account', () => {
      it('should debit the account', async () => {
        render(<Account />);

        // Check account has loaded with default balance of 800
        await waitFor(() => screen.getByText('£800.00'));

        const amountInput = screen.getByLabelText('amount-input');
        const dropdown = screen.getByLabelText('Open Drop');

        // Select DEBIT dropdown item
        fireEvent.change(amountInput, { target: { value: 101 } });
        fireEvent.click(dropdown);
        const creditDropdownOpt = screen.getByText('DEBIT');
        fireEvent.click(creditDropdownOpt);

        // Hit the form create button
        const createButton = await waitFor(() => screen.getByText(/Create/i));
        fireEvent.click(createButton);

        await waitFor(() => {
          // 101 minus the default balance = 699
          const [balance] = screen.getAllByText('£699.00');

          expect(balance).toBeInTheDocument();
        });
      });

      it('should alert when the balance reaches 0', async () => {
        render(<Account />);

        // Check account has loaded with default balance of 800
        await waitFor(() => screen.getByText('£800.00'));

        const amountInput = screen.getByLabelText('amount-input');
        const dropdown = screen.getByLabelText('Open Drop');

        // Select DEBIT dropdown item
        fireEvent.change(amountInput, { target: { value: 800 } });
        fireEvent.click(dropdown);
        const creditDropdownOpt = screen.getByText('DEBIT');
        fireEvent.click(creditDropdownOpt);

        // Hit the form create button
        const createButton = await waitFor(() => screen.getByText(/Create/i));
        fireEvent.click(createButton);

        await waitFor(() => screen.getByText(/Your balance has reached 0/i));
      });
    });
  });
});
