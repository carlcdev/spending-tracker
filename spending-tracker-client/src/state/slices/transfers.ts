import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { creditBalance, debitBalance } from './account';
import { open } from './notification';
import {
  getTransfers,
  postCredit,
  postDebit,
} from '../../services/transfer-service';

export interface CreateTransfer {
  accountId: string;
  type: 'DEBIT' | 'CREDIT';
  value: number;
}

export interface Transfer {
  id: string;
  accountId: string;
  type: 'DEBIT' | 'CREDIT';
  created: string;
  value: number;
}

interface TransfersState {
  transfers: Transfer[];
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
}

export const createTransfer = createAsyncThunk(
  'account/createTransferStatus',
  async ({ accountId, value, type }: CreateTransfer, thunkApi) => {
    try {
      // Adding 1s delay so you can appreciate the UI :) - not production ready, too fast locally
      await new Promise((resolve) =>
        setTimeout(
          resolve,
          parseInt(process.env.REACT_APP_SERVICE_DELAY as string)
        )
      );

      const createTransferMethod = type === 'CREDIT' ? postCredit : postDebit;
      const createTransferResponse = await createTransferMethod({
        accountId,
        value,
      });

      if (createTransferResponse.status === 201) {
        const transfer: Transfer = await createTransferResponse.json();

        if (transfer.type === 'CREDIT') {
          thunkApi.dispatch(creditBalance(transfer.value));
        }

        if (transfer.type === 'DEBIT') {
          thunkApi.dispatch(debitBalance(transfer.value));
        }

        return transfer;
      }

      if (createTransferResponse.status === 400) {
        const badReqMessage = await createTransferResponse.json();

        thunkApi.dispatch(open({ message: badReqMessage, type: 'error' }));

        return thunkApi.rejectWithValue(400);
      }

      const unknownErrorResponse = await createTransferResponse.json();

      return thunkApi.rejectWithValue(unknownErrorResponse);
    } catch (err) {
      thunkApi.dispatch(
        open({
          message: err.message, // Wouldnt want this message going to the user in prod
          type: 'error',
        })
      );
      return thunkApi.rejectWithValue('An unknown error occurred');
    }
  }
);

export const listTransfers = createAsyncThunk(
  'account/listTransfersStatus',
  async (accountId: string, thunkApi) => {
    try {
      // Adding 1s delay so you can appreciate the UI :) - not production ready, too fast locally
      await new Promise((resolve) =>
        setTimeout(
          resolve,
          parseInt(process.env.REACT_APP_SERVICE_DELAY as string)
        )
      );

      const transfersResponse = await getTransfers(accountId);

      if (transfersResponse.status === 200) {
        const account: Transfer[] = await transfersResponse.json();

        return account;
      }

      const unknownErrorResponse = await transfersResponse.json();

      return thunkApi.rejectWithValue(unknownErrorResponse);
    } catch (err) {
      thunkApi.dispatch(
        open({
          message: err.message, // Wouldnt want this message going to the user in prod
          type: 'error',
        })
      );
      return thunkApi.rejectWithValue('An unknown error occurred');
    }
  }
);

const initialState: TransfersState = {
  transfers: [],
  loading: 'idle',
};

const transfersSlice = createSlice({
  name: 'transfers',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(createTransfer.pending, (state, action) => {
        state.loading = 'pending';
      })
      .addCase(createTransfer.fulfilled, (state, action) => {
        state.transfers = [action.payload as Transfer, ...state.transfers];
        state.loading = 'succeeded';
      })
      .addCase(createTransfer.rejected, (state, action) => {
        state.loading = 'failed';
      })
      .addCase(listTransfers.pending, (state, action) => {
        state.loading = 'pending';
      })
      .addCase(listTransfers.fulfilled, (state, action) => {
        state.transfers = action.payload as Transfer[];
        state.loading = 'succeeded';
      })
      .addCase(listTransfers.rejected, (state, action) => {
        state.loading = 'failed';
      });
  },
});

export const selectTransfers = (state: any): TransfersState => state.transfers;

export const transfersReducer = transfersSlice.reducer;
