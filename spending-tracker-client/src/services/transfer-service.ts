import { v4 as uuid } from 'uuid';
import { API_URL } from '../config/config';

interface PostDebit {
  transactionId: string;
  accountId: string;
  value: number;
}

interface PostCredit {
  transactionId: string;
  accountId: string;
  value: number;
}

export async function postDebit({
  accountId,
  value,
  transactionId,
}: PostDebit) {
  const response = await fetch(
    `${API_URL}/accounts/${accountId}/transfers/debit`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Idempotency-Key': uuid(),
      },
      body: JSON.stringify({ transactionId, value }),
    }
  );

  return response;
}

export async function postCredit({
  accountId,
  value,
  transactionId,
}: PostCredit) {
  const response = await fetch(
    `${API_URL}/accounts/${accountId}/transfers/credit`,
    {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Idempotency-Key': uuid(),
      },
      body: JSON.stringify({ transactionId, value }),
    }
  );

  return response;
}

export async function getTransfers(accountId: string) {
  return fetch(`${API_URL}/accounts/${accountId}/transfers`);
}
