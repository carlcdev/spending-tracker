import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getAccountById, postAccount } from '../../services/account-service';
import { open } from '../../state/slices/notification';

export interface Account {
  id: string;
  balance: number;
}

interface AccountState {
  id: string;
  balance: number;
  loading: 'idle' | 'pending' | 'succeeded' | 'failed';
  accountStatus: 'found' | 'not-found' | 'unknown';
}

const initialState: AccountState = {
  id: '',
  balance: 0,
  loading: 'idle',
  accountStatus: 'unknown',
};

export const fetchAccountById = createAsyncThunk(
  'account/fetchAccountByIdStatus',
  async (accountId: string, thunkApi) => {
    try {
      // Adding 1s delay so you can appreciate the UI :) - not production ready, too fast locally
      await new Promise((resolve) =>
        setTimeout(
          resolve,
          parseInt(process.env.REACT_APP_SERVICE_DELAY as string)
        )
      );

      const accountResponse = await getAccountById(accountId);

      if (accountResponse.status === 200) {
        const account: Account = await accountResponse.json();

        return account;
      }

      if (accountResponse.status === 404) {
        return thunkApi.rejectWithValue(404);
      }

      const unknownErrorResponse = await accountResponse.json();

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

export const createAccount = createAsyncThunk(
  'account/createAccountStatus',
  async (accountId: string, thunkApi) => {
    try {
      // Adding 1s delay so you can appreciate the UI :) - not production ready, too fast locally
      await new Promise((resolve) =>
        setTimeout(
          resolve,
          parseInt(process.env.REACT_APP_SERVICE_DELAY as string)
        )
      );

      const accountResponse = await postAccount(accountId);

      if (accountResponse.status === 201) {
        const account: Account = await accountResponse.json();

        return account;
      }

      const unknownErrorResponse = await accountResponse.json();

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

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
    creditBalance(state, action) {
      state.balance = state.balance + action.payload;
    },
    debitBalance(state, action) {
      const newBalance = state.balance - action.payload;

      state.balance = newBalance;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccountById.pending, (state, action) => {
        state.loading = 'pending';
      })
      .addCase(fetchAccountById.fulfilled, (state, action) => {
        state.accountStatus = 'found';
        state.balance = action.payload.balance;
        state.id = action.payload.id;
        state.loading = 'succeeded';
      })
      .addCase(fetchAccountById.rejected, (state, action) => {
        if (action.payload === 404) {
          state.accountStatus = 'not-found';
        }

        state.loading = 'failed';
      })
      .addCase(createAccount.pending, (state, action) => {
        state.loading = 'pending';
      })
      .addCase(createAccount.fulfilled, (state, action) => {
        state.accountStatus = 'found';
        state.loading = 'succeeded';
        state.balance = action.payload.balance;
        state.id = action.payload.id;
      })
      .addCase(createAccount.rejected, (state, action) => {
        state.loading = 'failed';
      });
  },
});

export const selectAccount = (state: any): AccountState => state.account;

export const accountReducer = accountSlice.reducer;
export const { creditBalance, debitBalance } = accountSlice.actions;
