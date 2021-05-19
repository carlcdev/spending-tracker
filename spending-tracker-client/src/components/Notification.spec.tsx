import React from 'react';
import { render, screen, act, getStore } from '../config/test-utils';
import { open } from '../state/slices/notification';

describe('Notification', () => {
  it('should be hidden by default', () => {
    render(<p />);

    const notification = screen.queryByRole(/alert/i);

    expect(notification).not.toBeInTheDocument();
  });

  it('should show the notification when open', async () => {
    render(<p />);

    await act(async () => {
      getStore().dispatch(
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
      render(<p />);

      await act(async () => {
        getStore().dispatch(
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
      render(<p />);

      await act(async () => {
        getStore().dispatch(
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
