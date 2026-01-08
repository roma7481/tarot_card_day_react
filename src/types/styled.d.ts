import 'styled-components/native';
import { ThemeType } from '../theme/colors';

declare module 'styled-components/native' {
    export interface DefaultTheme extends ThemeType { }
}
