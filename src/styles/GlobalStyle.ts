import { createGlobalStyle } from 'styled-components';
import { backgroundColor, textColor } from './Themes';

export const GlobalStyles = createGlobalStyle`
    html, body {
        margin: 0;
        padding: 0;
    }
    *, *::after, *::before {
        box-sizing: border-box;
    }
    body {
        background: ${backgroundColor};
        color: ${textColor};
        font-family: 'Manrope', sans-serif;
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
`;
