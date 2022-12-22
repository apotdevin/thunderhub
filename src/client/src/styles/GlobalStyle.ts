import { createGlobalStyle } from 'styled-components';
import { backgroundColor, textColor } from './Themes';

export const GlobalStyles = createGlobalStyle`
    html, body {
        margin: 0;
        padding: 0;
    }
    * {
        font-variant-numeric: tabular-nums;
        font-family: 'Inter', sans-serif;
    }
    *, *::after, *::before {
        box-sizing: border-box;
    }
    body {
        background: ${backgroundColor};
        color: ${textColor};
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
`;
