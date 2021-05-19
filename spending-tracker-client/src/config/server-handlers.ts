import { v4 as uuid } from 'uuid';
import { rest } from 'msw';
import { API_URL } from '../config/config';

const handlers = [
  rest.get(`${API_URL}/accounts/12345678`, async (req, res, ctx) => {
    return res(
      ctx.json({
        id: '12345678',
        balance: 800,
      })
    );
  }),
  rest.post(`${API_URL}/accounts`, async (req, res, ctx) => {
    return res(
      ctx.status(201),
      ctx.json({
        id: '12345678',
        balance: 0,
      })
    );
  }),
  rest.get(`${API_URL}/accounts/12345678/transfers`, async (req, res, ctx) => {
    return res(
      ctx.json([
        {
          accountId: 'accountId',
          created: new Date().toISOString(),
          id: uuid(),
          type: 'CREDIT',
          value: 200,
        },
      ])
    );
  }),
  rest.post(
    `${API_URL}/accounts/12345678/transfers/credit`,
    async (req, res, ctx) => {
      const { value } = req.body as any;

      return res(
        ctx.status(201),
        ctx.json({
          accountId: '12345678',
          created: new Date().toISOString(),
          id: uuid(),
          type: 'CREDIT',
          value,
        })
      );
    }
  ),
  rest.post(
    `${API_URL}/accounts/12345678/transfers/debit`,
    async (req, res, ctx) => {
      const { value } = req.body as any;

      return res(
        ctx.status(201),
        ctx.json({
          accountId: '12345678',
          created: new Date().toISOString(),
          id: uuid(),
          type: 'DEBIT',
          value,
        })
      );
    }
  ),
];
export { handlers };
