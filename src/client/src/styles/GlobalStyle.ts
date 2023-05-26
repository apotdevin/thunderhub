import { createGlobalStyle } from 'styled-components';
import { backgroundColor, textColor } from './Themes';
import { Inter } from 'next/font/google';

const inter = Inter({ subsets: ['latin'] });

export const GlobalStyles = createGlobalStyle`
    html, body {
        margin: 0;
        padding: 0;
    }
    * {
        font-variant-numeric: tabular-nums;
        font-family: ${inter.style.fontFamily}, sans-serif;
    }
    *, *::after, *::before {
        box-sizing: border-box;
    }
    body {
        background: ${backgroundColor};
        color: ${textColor};
        font-variant-numeric: tabular-nums;
        font-family: ${inter.style.fontFamily}, sans-serif;
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
`;
