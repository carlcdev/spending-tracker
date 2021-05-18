import React from 'react';
import styled from 'styled-components';
import { Loading } from '../components/Loading';

const defaultProps = {
  accountSelected: false,
  loading: false,
  balance: 0,
  accountNumber: ''
};

type Props = {
  noAccountSelectedComponent: React.ReactNode;
} & typeof defaultProps;

const blueGradient = 'linear-gradient(rgb(111 106 255), rgb(81 76 255))';
const disabledGradient = 'linear-gradient(rgb(134 134 134),rgb(74 74 74))';

const AccountCardContainer = styled.div<{ accountSelected: boolean }>`
  width: 24rem;
  height: 14rem;
  background: ${({ accountSelected }) =>
    accountSelected ? blueGradient : disabledGradient};
  box-shadow: 1px 1px 4px 3px #ccc;
  border-radius: 1rem;
`;

const NoAccountBody = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  flex-direction: column;
`;

const AccountCardBody = styled.div<{ accountSelected: boolean }>`
  display: ${({ accountSelected }) => (accountSelected ? 'grid' : 'none')};
  grid-template-columns: 1fr 1fr 1fr;
  grid-template-rows: 1fr 1fr 1fr;
  grid-template-areas:
    '. . BankName'
    'AccountNumber AccountNumber AccountNumber'
    'Balance Balance Balance';
  height: 100%;
`;

const BankName = styled.div`
  grid-area: BankName;
  color: #fff;
  font-size: 1.5rem;
  font-weight: 700;
  opacity: 0.8;
  align-self: center;
  justify-self: center;
  text-transform: uppercase;
  font-style: italic;
`;

const AccountNumber = styled.div`
  grid-area: AccountNumber;
  color: #fff;
  font-size: 1.3rem;
  font-weight: 700;
  opacity: 0.8;
  align-self: center;
  padding-left: 1.6rem;
  letter-spacing: 0.3rem;
  text-transform: uppercase;
`;

const BalanceContainer = styled.div`
  grid-area: Balance;
  background: rgba(255, 255, 255, 0.2);
  font-size: 1.3rem;
  font-weight: 700;
  align-self: center;
  justify-self: center;
  height: 100%;
  width: 100%;
  text-align: center;
`;

const Balance = styled.div`
  color: #fff;
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100%;
  font-size: 1.6rem;
`;

export function AccountCard({
  accountSelected,
  noAccountSelectedComponent,
  loading,
  balance,
  accountNumber
}: Props) {
  return (
    <AccountCardContainer accountSelected={accountSelected}>
      {loading && (
        <NoAccountBody><Loading /></NoAccountBody>
      )}
      {!accountSelected && !loading && (
        <NoAccountBody>{noAccountSelectedComponent}</NoAccountBody>
      )}
      <AccountCardBody accountSelected={accountSelected}>
        <BankName>bank</BankName>
        <AccountNumber>{accountNumber}</AccountNumber>
        <BalanceContainer>
          <Balance>£{balance}</Balance>
        </BalanceContainer>
      </AccountCardBody>
    </AccountCardContainer>
  );
}

AccountCard.defaultProps = defaultProps;
