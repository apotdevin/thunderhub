import { createGlobalStyle } from 'styled-components';
import { backgroundColor, textColor } from './Themes';

export const GlobalStyles = createGlobalStyle`
    @font-face {
        font-family: 'Roboto';
        src: url('/fonts/roboto/Roboto-Thin.ttf') format('truetype');
        font-weight: 100;
        font-style: normal;
    }
    @font-face {
        font-family: 'Roboto';
        src: url('/fonts/roboto/Roboto-ThinItalic.ttf') format('truetype');
        font-weight: 100;
        font-style: italic;
    }
    @font-face {
        font-family: 'Roboto';
        src: url('/fonts/roboto/Roboto-Light.ttf') format('truetype');
        font-weight: 300;
        font-style: normal;
    }
    @font-face {
        font-family: 'Roboto';
        src: url('/fonts/roboto/Roboto-LightItalic.ttf') format('truetype');
        font-weight: 300;
        font-style: italic;
    }
    @font-face {
        font-family: 'Roboto';
        src: url('/fonts/roboto/Roboto-Regular.ttf') format('truetype');
        font-weight: 400;
        font-style: normal;
    }
    @font-face {
        font-family: 'Roboto';
        src: url('/fonts/roboto/Roboto-Italic.ttf') format('truetype');
        font-weight: 400;
        font-style: italic;
    }
    @font-face {
        font-family: 'Roboto';
        src: url('/fonts/roboto/Roboto-Medium.ttf') format('truetype');
        font-weight: 500;
        font-style: normal;
    }
    @font-face {
        font-family: 'Roboto';
        src: url('/fonts/roboto/Roboto-MediumItalic.ttf') format('truetype');
        font-weight: 500;
        font-style: italic;
    }
    @font-face {
        font-family: 'Roboto';
        src: url('/fonts/roboto/Roboto-Bold.ttf') format('truetype');
        font-weight: 700;
        font-style: normal;
    }
    @font-face {
        font-family: 'Roboto';
        src: url('/fonts/roboto/Roboto-BoldItalic.ttf') format('truetype');
        font-weight: 700;
        font-style: italic;
    }
    @font-face {
        font-family: 'Roboto';
        src: url('/fonts/roboto/Roboto-Black.ttf') format('truetype');
        font-weight: 900;
        font-style: normal;
    }
    @font-face {
        font-family: 'Roboto';
        src: url('/fonts/roboto/Roboto-BlackItalic.ttf') format('truetype');
        font-weight: 900;
        font-style: italic;
    }

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
        font-family: 'Roboto', sans-serif;
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
`;
