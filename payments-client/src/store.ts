import { configureStore } from '@reduxjs/toolkit';
import { accountReducer } from './state/slices/account';
import { transfersReducer } from './state/slices/transfers';
import { notificationReducer } from './state/slices/notification';

export const store = configureStore({
  reducer: {
    account: accountReducer,
    notification: notificationReducer,
    transfers: transfersReducer,
  },
});

// Infer the `RootState` and `AppDispatch` types from the store itself
export type RootState = ReturnType<typeof store.getState>;
// Inferred type: {posts: PostsState, comments: CommentsState, users: UsersState}
export type AppDispatch = typeof store.dispatch;
