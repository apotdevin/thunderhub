import { FC, ReactNode, useEffect } from 'react';
import { StyleSheetManager, ThemeProvider } from 'styled-components';
import { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from '../config/client';
import { BaseProvider } from '../src/context/BaseContext';
import { ContextProvider } from '../src/context/ContextProvider';
import { useConfigState, ConfigProvider } from '../src/context/ConfigContext';
import { GlobalStyles } from '../src/styles/GlobalStyle';
import { Header } from '../src/layouts/header/Header';
import { Footer } from '../src/layouts/footer/Footer';
import { PageWrapper, HeaderBodyWrapper } from '../src/layouts/Layout.styled';
import { ToastContainer } from 'react-toastify';
import { useListener } from '../src/hooks/UseListener';
import { SocketProvider } from '../src/context/SocketContext';
import { useRouter } from 'next/router';
import getConfig from 'next/config';
import Head from 'next/head';
import isPropValid from '@emotion/is-prop-valid';

import 'react-toastify/dist/ReactToastify.min.css';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import 'react-circular-progressbar/dist/styles.css';

const { publicRuntimeConfig } = getConfig();
const { logoutUrl } = publicRuntimeConfig;

function shouldForwardProp(propName: string, target: any) {
  if (typeof target === 'string') {
    // For HTML elements, forward the prop if it is a valid HTML attribute
    return isPropValid(propName);
  }
  // For other elements, forward all props
  return true;
}

const NotAuthenticated: React.FC = () => {
  const { push } = useRouter();

  useEffect(() => {
    push(logoutUrl || '/login');
  }, [push]);

  return null;
};

const Listener: FC<{ isRoot: boolean }> = ({ isRoot }) => {
  useListener(isRoot);
  return null;
};

const Wrapper: React.FC<{ authenticated: boolean; children?: ReactNode }> = ({
  children,
  authenticated,
}) => {
  const { theme } = useConfigState();
  const { pathname } = useRouter();

  const isRoot = pathname === '/login' || pathname === '/sso';

  return (
    <ThemeProvider theme={{ mode: isRoot ? 'light' : theme }}>
      <GlobalStyles />
      <PageWrapper>
        <HeaderBodyWrapper>
          <Header />
          <Listener isRoot={isRoot} />
          {authenticated ? children : <NotAuthenticated />}
        </HeaderBodyWrapper>
        <Footer />
        <ToastContainer theme={theme === 'light' ? 'light' : 'dark'} />
      </PageWrapper>
    </ThemeProvider>
  );
};

export default function App({ Component, pageProps }: AppProps) {
  const {
    initialApolloState,
    initialConfig,
    hasToken,
    authToken,
    authenticated,
  } = pageProps;

  const apolloClient = useApollo(authToken, initialApolloState);

  return (
    <StyleSheetManager shouldForwardProp={shouldForwardProp}>
      <ApolloProvider client={apolloClient}>
        <Head>
          <title>ThunderHub - Lightning Node Manager</title>
        </Head>
        <ConfigProvider initialConfig={initialConfig}>
          <BaseProvider initialHasToken={hasToken}>
            <SocketProvider authToken={authToken}>
              <ContextProvider>
                <Wrapper authenticated={authenticated}>
                  <Component {...pageProps} />
                </Wrapper>
              </ContextProvider>
            </SocketProvider>
          </BaseProvider>
        </ConfigProvider>
      </ApolloProvider>
    </StyleSheetManager>
  );
}
