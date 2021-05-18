import React from 'react';
import styled from 'styled-components';
import { Button as GrommetButton, ButtonType } from 'grommet';
import { Loading } from './Loading';

type Props = {
  loading?: boolean;
  label?: string;
  size?: string;
} & ButtonType;

const StyledSpinner = styled(Loading)`
  width: 1.5rem;
  height: 1.5rem;
`;

const LoadingButton = styled(GrommetButton)<{ loading: boolean }>`
  opacity: 1;
  text-align: center;
`;

export function Button({ loading, label, ...props }: Props) {
  if (loading)
    return <LoadingButton {...props} disabled icon={<StyledSpinner />} />;

  return <GrommetButton label={label} {...props} />;
}
