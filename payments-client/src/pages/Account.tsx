import React, { useEffect, useState } from 'react';
import styled from 'styled-components';
import { Form, FormField, TextInput, Select } from 'grommet';
import { Main } from '../components/layout/Main';
import { useAppDispatch, useAppSelector, usePrevious } from '../hooks';
import {
  fetchAccountById,
  selectAccount,
  createAccount,
} from '../state/slices/account';
import {
  listTransfers,
  selectTransfers,
  createTransfer,
} from '../state/slices/transfers';
import { open } from '../state/slices/notification';
import { AccountCard } from '../components/AccountCard';
import { Button } from '../components/Button';
import { TransfersList } from '../components/TransfersList';

interface TransferFormInput {
  amount: string;
  type: 'CREDIT' | 'DEBIT' | '';
}

const CreateTransferForm = styled(Form)`
  gap: 1rem;
  display: flex;
`;

const CreateButton = styled(Button)`
  height: 3rem;
  width: 8rem;
`;

const InlineFormField = styled(FormField)`
  display: inline-flex;
  margin-bottom: 0;
  flex-grow: 1;
`;

const AccountCardContainer = styled.div<{ accountSelected: boolean }>`
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
  transition: 1s height;
  ${({ accountSelected }) => (accountSelected ? 'height: 18rem;' : '')}
`;

const TransfersContainer = styled.div<{ accountSelected: boolean }>`
  opacity: ${({ accountSelected }) => (accountSelected ? '1' : '0')};
  transition: 0.5s opacity;
  transition-delay: 0.8s;
  max-width: 1000px;
  margin: auto;
`;

const PageTitle = styled.h1`
  font-size: 2rem;
`;

const NoAccountContainer = styled.div`
  color: #fff;
`;

const StyledTransfersList = styled(TransfersList)`
  margin-top: 1rem;
  width: 100%;
`;

function NoAccountFoundComponent() {
  const dispatch = useAppDispatch();

  return (
    <>
      <NoAccountContainer>
        <p>No account found</p>
      </NoAccountContainer>
      <div>
        <Button
          primary
          label="Create account"
          size="small"
          onClick={() => dispatch(createAccount('12345678'))}
        />
      </div>
    </>
  );
}
const accountId = '12345678'; // Hard coded for demo

export function Account() {
  const dispatch = useAppDispatch();
  const accountState = useAppSelector(selectAccount);
  const transfersState = useAppSelector(selectTransfers);
  const accountSelected = !!accountState.id;
  const loading =
    accountState.loading === 'pending' || transfersState.loading === 'pending';
  const initialFormState: TransferFormInput = {
    amount: '',
    type: '',
  };
  const prevBalance: any = usePrevious(accountState.balance);

  useEffect(() => {
    if (prevBalance > 0 && accountState.balance === 0) {
      dispatch(
        open({
          message: 'Your balance has reached 0',
          type: 'warning',
        })
      );
    }
  }, [dispatch, prevBalance, accountState.balance]);

  const [form, setForm] = useState<TransferFormInput>({
    amount: '',
    type: '',
  });

  useEffect(() => {
    if (accountState.loading === 'idle') {
      dispatch(fetchAccountById(accountId));
    }

    if (
      accountState.loading === 'succeeded' &&
      transfersState.loading === 'idle'
    ) {
      dispatch(listTransfers(accountId));
    }
  }, [dispatch, accountState.loading, transfersState.loading]);

  return (
    <Main>
      <AccountCardContainer accountSelected={accountSelected}>
        <AccountCard
          loading={loading}
          account={{
            accountNumber: accountState.id,
            balance: accountState.balance,
          }}
          noAccountSelectedComponent={<NoAccountFoundComponent />}
        />
      </AccountCardContainer>
      <TransfersContainer accountSelected={accountSelected}>
        <PageTitle>Transfers</PageTitle>
        <CreateTransferForm
          noValidate
          value={form}
          onChange={(nextValue) => {
            setForm(nextValue as TransferFormInput);
          }}
          onSubmit={(event) => {
            const { type, amount } = event.value as TransferFormInput;
            const transactionType = type as 'DEBIT' | 'CREDIT';

            setForm(initialFormState);
            dispatch(
              createTransfer({
                accountId,
                type: transactionType,
                value: parseFloat(amount),
              })
            );
          }}
        >
          <InlineFormField
            name="amount"
            validate={(amount) => {
              if (amount <= 0) {
                return 'Must be greater than 0';
              }

              if (amount <= 0) {
                return 'Must be greater than 0';
              }

              return undefined;
            }}
          >
            <TextInput
              name="amount"
              type="number"
              min="0"
              step="0.01"
              placeholder="Transfer amount (£)"
            />
          </InlineFormField>
          <InlineFormField
            name="type"
            validate={(type) => {
              if (!type) {
                return 'Select a type';
              }

              return undefined;
            }}
          >
            <Select
              id="type"
              name="type"
              placeholder="Type"
              options={['CREDIT', 'DEBIT']}
            />
          </InlineFormField>
          <CreateButton
            type="submit"
            label="Create"
            primary
            size="small"
            loading={transfersState.loading === 'pending'}
          />
        </CreateTransferForm>
        <StyledTransfersList transfers={transfersState.transfers} />
      </TransfersContainer>
    </Main>
  );
}
