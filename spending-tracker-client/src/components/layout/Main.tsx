import React from 'react';
import styled from 'styled-components';

type Props = {
  children: React.ReactNode;
};

const StyledMain = styled.main`
  max-width: 1600px;
  padding: 0px 4rem;
  margin: auto;
`;

export function Main(props: Props) {
  return <StyledMain {...props} />;
}
