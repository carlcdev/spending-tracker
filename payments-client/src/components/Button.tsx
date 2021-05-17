import React from 'react';
import { Button as GrommetButton, ButtonType } from 'grommet';

type Props = {
  label?: string;
  size?: string;
} & ButtonType;

export function Button({ label, ...props }: Props) {

  return <GrommetButton label={label} {...props} />;
}
