import { API_URL } from '../config/config';

export async function getAccountById(accountId: string) {
  return fetch(`${API_URL}/accounts/${accountId}`);
}

export async function postAccount(accountId: string) {
  const response = await fetch(`${API_URL}/accounts`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ id: accountId }),
  });

  return response;
}
