import React from 'react';
import { render, RenderOptions } from '@testing-library/react';
import { ThemeProvider } from 'styled-components';
import { Grommet } from 'grommet';
import { Provider } from 'react-redux';
import { grommetTheme } from '../theme/grommet-theme';
import { store } from '../store';
import * as theme from '../theme/theme';

const AllTheProviders: any = ({
  children,
}: {
  children: React.ReactElement;
}) => {
  return (
    <Grommet theme={grommetTheme}>
      <ThemeProvider theme={theme}>
        <Provider store={store}>{children}</Provider>
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
