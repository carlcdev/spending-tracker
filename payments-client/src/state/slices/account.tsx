import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';

interface AccountState {
  id: string;
  balance: number;
  loading: 'idle' | 'pending' | 'succeeded' | 'failed' | 'not-found';
}

export const fetchAccountById = createAsyncThunk(
  'account/fetchAccountByIdStatus',
  async (accountId: string, thunkApi) => {
    // Adding a delay so you can appreciate the UI
    const val = await new Promise((resolve) => {
      setTimeout(() => {
        resolve('testing');
      }, 1000);
    });

    if (val === 'test') {
        return thunkApi.rejectWithValue(404);
    }

    return {
      id: accountId,
      balance: 100,
    };
  }
);

const initialState: AccountState = {
  id: '',
  balance: 0,
  loading: 'idle',
};

const accountSlice = createSlice({
  name: 'account',
  initialState,
  reducers: {
      accountNotFound(state) {
        state.loading = 'not-found';
      }
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccountById.pending, (state, action) => {
        state.loading = 'pending';
      })
      .addCase(fetchAccountById.fulfilled, (state, action) => {
        state.balance = action.payload.balance;
        state.id = action.payload.id;
        state.loading = 'succeeded';
      })
      .addCase(fetchAccountById.rejected, (state, action) => {
        if (action.payload === 404) {
            state.loading = 'not-found';
        } else {
            state.loading = 'failed';
        }
      });
  },
});

export const selectAccount = (state: any): AccountState => state.account;

export const accountReducer = accountSlice.reducer;
export const { accountNotFound } = accountSlice.actions;
