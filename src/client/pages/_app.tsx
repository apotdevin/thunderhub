import { useEffect, VFC } from 'react';
import { ThemeProvider } from 'styled-components';
import { ModalProvider, BaseModalBackground } from 'styled-react-modal';
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

import 'react-toastify/dist/ReactToastify.min.css';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';
import 'react-circular-progressbar/dist/styles.css';
import { NostrProvider } from '../src/context/NostrContext';

const { publicRuntimeConfig } = getConfig();
const { logoutUrl } = publicRuntimeConfig;

const NotAuthenticated: React.FC = () => {
  const { push } = useRouter();

  useEffect(() => {
    push(logoutUrl || '/login');
  }, [push]);

  return null;
};

const Listener: VFC<{ isRoot: boolean }> = ({ isRoot }) => {
  useListener(isRoot);
  return null;
};

const Wrapper: React.FC<{ authenticated: boolean }> = ({
  children,
  authenticated,
}) => {
  const { theme } = useConfigState();
  const { pathname } = useRouter();

  const isRoot = pathname === '/login' || pathname === '/sso';

  return (
    <ThemeProvider theme={{ mode: isRoot ? 'light' : theme }}>
      <ModalProvider backgroundComponent={BaseModalBackground}>
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
      </ModalProvider>
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
    <ApolloProvider client={apolloClient}>
      <Head>
        <title>ThunderHub - Lightning Node Manager</title>
      </Head>
      <ConfigProvider initialConfig={initialConfig}>
        <BaseProvider initialHasToken={hasToken}>
          <SocketProvider authToken={authToken}>
            <NostrProvider>
              <ContextProvider>
                <Wrapper authenticated={authenticated}>
                  <Component {...pageProps} />
                </Wrapper>
              </ContextProvider>
            </NostrProvider>
          </SocketProvider>
        </BaseProvider>
      </ConfigProvider>
    </ApolloProvider>
  );
}
