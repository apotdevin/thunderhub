import { createGlobalStyle } from 'styled-components';
import { backgroundColor, textColor } from './Themes';
import { Noto_Sans } from 'next/font/google';

const notoSans = Noto_Sans({
  weight: ['100', '200', '300', '400', '500', '600', '700', '800', '900'],
  subsets: ['latin'],
});

export const GlobalStyles = createGlobalStyle`
    html, body {
        margin: 0;
        padding: 0;
    }
    * {
        font-variant-numeric: tabular-nums;
        font-family: ${notoSans.style.fontFamily}, sans-serif;
    }
    *, *::after, *::before {
        box-sizing: border-box;
    }
    body {
        background: ${backgroundColor};
        color: ${textColor};
        font-variant-numeric: tabular-nums;
        font-family: ${notoSans.style.fontFamily}, sans-serif;
        text-rendering: optimizeLegibility;
        -webkit-font-smoothing: antialiased;
        -moz-osx-font-smoothing: grayscale;
    }
`;
