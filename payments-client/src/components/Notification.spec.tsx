import React from 'react';
import { render, screen, act } from '../config/test-utils';
import { Provider } from 'react-redux';
import { store } from '../store';
import { Notification } from './Notification';
import { open } from '../state/slices/notification';

describe('Notification', () => {
  it('should be hidden by default', () => {
    render(<Notification />);

    const notification = screen.queryByRole(/alert/i);

    expect(notification).not.toBeInTheDocument();
  });

  it('should show the notification when open', async () => {
    render(<Notification />);

    await act(async () => {
      store.dispatch(
        open({
          message: 'Test Message',
          type: 'error',
        })
      );
    });

    const notification = screen.getByRole(/alert/i);

    expect(notification).toBeInTheDocument();
  });

  describe('when the type is error', () => {
    it('should show the error label with the message', async () => {
      render(<Notification />);

      await act(async () => {
        store.dispatch(
          open({
            message: 'Error Message',
            type: 'error',
          })
        );
      });

      const [notification] = screen.getAllByText(/Error: Error Message/i);

      expect(notification).toBeInTheDocument();
    });
  });

  describe('when the type is warning', () => {
    it('should show the warning label with the message', async () => {
      render(<Notification />);

      await act(async () => {
        store.dispatch(
          open({
            message: 'Warning Message',
            type: 'warning',
          })
        );
      });

      const [notification] = screen.getAllByText(/Warning: Warning Message/i);

      expect(notification).toBeInTheDocument();
    });
  });
});
