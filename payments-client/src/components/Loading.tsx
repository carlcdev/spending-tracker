import React from 'react';
import { Meter, ButtonProps } from 'grommet';
import styled from 'styled-components';

const LoadingIndicator = styled(Meter)`
  @keyframes spin {
    100% {
      -webkit-transform: rotate(360deg);
      transform: rotate(360deg);
    }
  }
  animation: spin 1s linear infinite;
  width: 5rem;
  height: 5rem;
`;

export function Loading(props: ButtonProps) {
  return (
    <LoadingIndicator
      type="circle"
      values={[
        {
          value: 75,
        },
      ]}
      aria-label="loading"
      round
      {...props}
    ></LoadingIndicator>
  );
}
