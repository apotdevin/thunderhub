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
        /* color: ${textColor}; */
        /* font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif, "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol"; */
        font-family: Manrope;
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
        /* align-items: center; */
        /* display: flex; */
        /* justify-content: center; */
        /* height: 100vh; */
    }
`;
