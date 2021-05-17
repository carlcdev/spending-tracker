import React from 'react';
import styled from 'styled-components';
import { AccountCard } from '../components/AccountCard';
import { Button } from '../components/Button';

const AccountCardContainer = styled.div`
  display: flex;
  height: 100vh;
  justify-content: center;
  align-items: center;
`;

const NoAccountContainer = styled.div`
  color: #fff;
`;

function NoAccountFoundComponent() {
  return (
    <>
      <NoAccountContainer>
        <p>No account found</p>
      </NoAccountContainer>
      <div>
        <Button primary label="Create account" size="small"/>
      </div>
    </>
  );
}

export function Account() {
  return (
    <AccountCardContainer>
      <AccountCard
        loading={true}
        accountSelected={false}
        noAccountSelectedComponent={<NoAccountFoundComponent />}
      />
    </AccountCardContainer>
  );
}
