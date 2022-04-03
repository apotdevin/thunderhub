import * as React from 'react';
import Document, {
  DocumentContext,
  Html,
  Head,
  Main,
  NextScript,
} from 'next/document';
import { ServerStyleSheet } from 'styled-components';

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet();
    const originalRenderPage = ctx.renderPage;

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          // eslint-disable-next-line react/display-name
          enhanceApp: App => props => sheet.collectStyles(<App {...props} />),
        });

      const initialProps = await Document.getInitialProps(ctx);
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      };
    } finally {
      sheet.seal();
    }
  }

  render() {
    return (
      <Html>
        <Head>
          <meta
            name="description"
            content="Manage and monitor your lightning network node right inside your browser"
            key="description"
          />
          <link
            rel="preload"
            href="/fonts/roboto/Roboto-Thin.ttf"
            as="font"
            type="font/ttf"
            crossOrigin=""
          />
          <link
            rel="preload"
            href="/fonts/roboto/Roboto-ThinItalic.ttf"
            as="font"
            type="font/ttf"
            crossOrigin=""
          />
          <link
            rel="preload"
            href="/fonts/roboto/Roboto-Light.ttf"
            as="font"
            type="font/ttf"
            crossOrigin=""
          />
          <link
            rel="preload"
            href="/fonts/roboto/Roboto-LightItalic.ttf"
            as="font"
            type="font/ttf"
            crossOrigin=""
          />
          <link
            rel="preload"
            href="/fonts/roboto/Roboto-Regular.ttf"
            as="font"
            type="font/ttf"
            crossOrigin=""
          />
          <link
            rel="preload"
            href="/fonts/roboto/Roboto-Italic.ttf"
            as="font"
            type="font/ttf"
            crossOrigin=""
          />
          <link
            rel="preload"
            href="/fonts/roboto/Roboto-Medium.ttf"
            as="font"
            type="font/ttf"
            crossOrigin=""
          />
          <link
            rel="preload"
            href="/fonts/roboto/Roboto-MediumItalic.ttf"
            as="font"
            type="font/ttf"
            crossOrigin=""
          />
          <link
            rel="preload"
            href="/fonts/roboto/Roboto-Bold.ttf"
            as="font"
            type="font/ttf"
            crossOrigin=""
          />
          <link
            rel="preload"
            href="/fonts/roboto/Roboto-BoldItalic.ttf"
            as="font"
            type="font/ttf"
            crossOrigin=""
          />
          <link
            rel="preload"
            href="/fonts/roboto/Roboto-Black.ttf"
            as="font"
            type="font/ttf"
            crossOrigin=""
          />
          <link
            rel="preload"
            href="/fonts/roboto/Roboto-BlackItalic.ttf"
            as="font"
            type="font/ttf"
            crossOrigin=""
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}
