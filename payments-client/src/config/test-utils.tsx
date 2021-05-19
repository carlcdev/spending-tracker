import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { Grommet } from 'grommet';
import { Provider } from 'react-redux';
import { configureStore } from '@reduxjs/toolkit';
import { Notification } from '../components/Notification';
import { grommetTheme } from '../theme/grommet-theme';
import { accountReducer } from '../state/slices/account';
import { notificationReducer } from '../state/slices/notification';
import { transfersReducer } from '../state/slices/transfers';
import * as theme from '../theme/theme';

const AllTheProviders: any = ({
  children,
}: {
  children: React.ReactElement;
}) => {
  const store = configureStore({
    reducer: {
      account: accountReducer,
      notification: notificationReducer,
      transfers: transfersReducer,
    },
  });
  return (
    <Grommet theme={grommetTheme}>
      <ThemeProvider theme={theme}>
        <Provider store={store}>
          <Notification />
          {children}
        </Provider>
      </ThemeProvider>
    </Grommet>
  );
};

const customRender = (ui: React.ReactElement, options?: RenderOptions) =>
  render(ui, { wrapper: AllTheProviders, ...options });

// re-export everything
export * from '@testing-library/react';

// override render method
export { customRender as render };
