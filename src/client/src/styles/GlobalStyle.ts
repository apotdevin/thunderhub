import { createGlobalStyle } from 'styled-components';
import { backgroundColor, textColor } from './Themes';

const fontFamily = "'Noto Sans', sans-serif";

export const GlobalStyles = createGlobalStyle`
    @import url('https://fonts.googleapis.com/css2?family=Noto+Sans:wght@100;200;300;400;500;600;700;800;900&display=swap');
    html, body {
        margin: 0;
        padding: 0;
    }
    * {
        font-variant-numeric: tabular-nums;
        font-family: ${fontFamily};
    }
    *, *::after, *::before {
        box-sizing: border-box;
    }
    body {
        background: ${backgroundColor};
        color: ${textColor};
        font-variant-numeric: tabular-nums;
        font-family: ${fontFamily};
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
`;
