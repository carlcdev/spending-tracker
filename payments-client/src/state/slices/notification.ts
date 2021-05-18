import { createSlice } from '@reduxjs/toolkit';

interface NotificationState {
  message: string;
  open: boolean;
  type: 'error' | 'warning'; // Could extend with success etc but only needed for error in this project
}

interface OpenNotificationAction {
  message: string;
  type: 'error' | 'warning';
}

const initialState: NotificationState = {
  message: '',
  open: false,
  type: 'error',
};

const notificationSlice = createSlice({
  name: 'notification',
  initialState,
  reducers: {
    open(state, { payload }: { payload: OpenNotificationAction }) {
      state.open = true;
      state.message = payload.message;
      state.type = payload.type;
    },
    close(state) {
      state.open = false;
      state.message = '';
    },
  },
});

export const selectNotification = (state: any): NotificationState =>
  state.notification;

export const notificationReducer = notificationSlice.reducer;
export const { open, close } = notificationSlice.actions;
