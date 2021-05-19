import { ThemeType } from 'grommet';
import * as theme from './theme';

export const grommetTheme: ThemeType = {
  global: {
    colors: {
      brand: theme.colourPalette.primary,
    },
    font: {
      family: '-apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Ca' +
      'ntarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif;',
      size: '1.4rem',
      height: '2rem',
    },
  },
  text: {
    medium: {
      size: '1.6rem',
    },
    small: {
      size: '1.4rem',
    },
  },
  textInput: {
    // extend: `
    //   &:focus {
    //     box-shadow: 0 0 0 1px rgba(50,151,211,.3), 0 1px 1px 0 rgba(0,0,0,.07), 0 0 0 4px rgba(50,151,211,.3);
    //   }
    // `,
  },
  formField: {
    extend: `label {
      font-weight: 700;
    }
    `,
    border: {
      error: {
        color: theme.colourPalette.error,
      },
      color: 'border',
      side: 'all',
    },
    disabled: {
      background: {
        color: undefined,
      },
      border: {
        color: 'status-disabled',
      },
      label: {
        color: 'status-disabled',
      },
    },
    error: {
      color: theme.colourPalette.error,
      margin: {
        start: 'none',
      },
    },
    help: {
      color: 'text-weak',
      margin: {
        start: 'none',
        bottom: 'xsmall',
      },
    },
    info: {
      color: theme.colourPalette.info,
      margin: {
        start: 'none',
      },
    },
    label: {
      size: 'xsmall',
      margin: {
        horizontal: 'none',
      },
    },
    round: '4px',
  },
  checkBox: {
    extend: `
      font-size: 1.2rem;
    `,
  },
};
