import React from 'react';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter as Router } from 'react-router-dom';
import { Grommet } from 'grommet';
import { Provider } from 'react-redux';
import GlobalStyle from './theme/global-styles';
import { grommetTheme } from './theme/grommet-theme';
import * as theme from './theme/theme';
import { Routes } from './Routes';
import { Notification } from './components/Notification';
import { store } from './state/store';

function App() {
  return (
    <Grommet theme={grommetTheme}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Provider store={store}>
          <Router>
            <Routes />
          </Router>
          <Notification />
        </Provider>
      </ThemeProvider>
    </Grommet>
  );
}

export default App;
