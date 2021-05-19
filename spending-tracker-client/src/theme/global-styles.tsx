import { createGlobalStyle } from 'styled-components';

import { colourPalette, baseFontSize, fontFamily } from './theme';

const GlobalStyle = createGlobalStyle`
    html {
        font-size: ${baseFontSize};
    }
    body {
        background-color: ${colourPalette.backgroundColor};
        font-family: ${fontFamily};
        color: ${colourPalette.charcoal};
        margin: 0;
        padding: 0;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        font-size: 1.4rem;
    }
    * {
        box-sizing: border-box;
    }
`;

export default GlobalStyle;
