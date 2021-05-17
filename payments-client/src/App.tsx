import React from 'react';
import { ThemeProvider } from 'styled-components';
import { BrowserRouter as Router } from 'react-router-dom';
import { Grommet } from 'grommet';
import GlobalStyle from './theme/global-styles';
import { grommetTheme } from './theme/grommet-theme';
import * as theme from './theme/theme';
import { Routes } from './Routes';

function App() {
  return (
    <Grommet theme={grommetTheme}>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
        <Router>
          <Routes />
        </Router>
      </ThemeProvider>
    </Grommet>
  );
}

export default App;
