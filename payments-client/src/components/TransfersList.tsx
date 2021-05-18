import React from 'react';
import styled from 'styled-components';
import { Table, TableHeader, TableBody, TableRow, TableCell } from 'grommet';
import { Transfer } from '../state/slices/transfers';

const defaultProps = {
  className: '',
  transfers: [],
};

const NoTransferFoundCell = styled(TableCell)`
  padding-top: 2rem;
`;

type Props = { className: string; transfers: Transfer[] };

export function TransfersList({ transfers, ...props }: Props) {
  return (
    <Table {...props}>
      <TableHeader>
        <TableRow>
          <TableCell scope="col">Amount (£)</TableCell>
          <TableCell scope="col">Type</TableCell>
          <TableCell scope="col">Date</TableCell>
        </TableRow>
      </TableHeader>
      <TableBody>
        {!transfers.length && (
          <TableRow>
            <NoTransferFoundCell align="center" colSpan={3}>
              No transfers found
            </NoTransferFoundCell>
          </TableRow>
        )}
        {transfers.map((transfer) => (
          <TableRow key={transfer.id}>
            <TableCell>
              {new Intl.NumberFormat('en-GB', {
                style: 'currency',
                currency: 'GBP',
              }).format(transfer.value)}
            </TableCell>
            <TableCell>{transfer.type}</TableCell>
            <TableCell>
              {new Intl.DateTimeFormat('en-GB', {
                dateStyle: 'short',
                timeStyle: 'long',
              }).format(new Date(transfer.created))}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
}

TransfersList.defaultProps = defaultProps;
