import 'styled-components';
import * as theme from './theme/theme';

type MainTheme = typeof theme;

// and extend them!
declare module 'styled-components' {
  export interface DefaultTheme extends MainTheme {}
}
