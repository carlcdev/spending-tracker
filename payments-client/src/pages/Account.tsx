import React from 'react';
import styled from 'styled-components';
import { useAppDispatch, useAppSelector } from '../hooks';
import { fetchAccountById, selectAccount } from '../state/slices/account';
import { AccountCard } from '../components/AccountCard';
import { Button } from '../components/Button';

const AccountCardContainer = styled.div<{ accountSelected: boolean }>`
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
  transition: 1s height;
  ${({ accountSelected }) => (accountSelected ? 'height: 18rem;' : '')}
`;

const TransferContainer = styled.div<{ accountSelected: boolean }>`
  opacity: ${({ accountSelected }) => (accountSelected ? '1' : '0')};
  transition: 2s opacity;
`;

const NoAccountContainer = styled.div`
  color: #fff;
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
          onClick={() => dispatch(fetchAccountById('12345678'))}
        />
      </div>
    </>
  );
}

export function Account() {
  const dispatch = useAppDispatch();
  const accountState = useAppSelector(selectAccount);
  const accountSelected = !!accountState.id;

  if (accountState.loading === 'idle') {
    dispatch(fetchAccountById('12345678'));
  }

  return (
    <>
      <AccountCardContainer accountSelected={accountSelected}>
        <AccountCard
          loading={accountState.loading === 'pending'}
          accountSelected={accountSelected}
          noAccountSelectedComponent={<NoAccountFoundComponent />}
          accountNumber={accountState.id}
          balance={accountState.balance}
        />
      </AccountCardContainer>
      <TransferContainer accountSelected={accountSelected}>
        <p>test</p>
      </TransferContainer>
    </>
  );
}
