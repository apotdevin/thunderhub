import { ThemeProvider } from 'styled-components';
import { ModalProvider, BaseModalBackground } from 'styled-react-modal';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { StyledToastContainer } from 'src/components/toastContainer/ToastContainer';
import { AppProps } from 'next/app';
import { ApolloProvider } from '@apollo/client';
import { useApollo } from 'config/client';
import { BaseProvider } from 'src/context/BaseContext';
import { ContextProvider } from '../src/context/ContextProvider';
import { useConfigState, ConfigProvider } from '../src/context/ConfigContext';
import { GlobalStyles } from '../src/styles/GlobalStyle';
import { Header } from '../src/layouts/header/Header';
import { Footer } from '../src/layouts/footer/Footer';
import 'react-toastify/dist/ReactToastify.min.css';
import { PageWrapper, HeaderBodyWrapper } from '../src/layouts/Layout.styled';
import 'react-circular-progressbar/dist/styles.css';

const Wrapper: React.FC = ({ children }) => {
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
            {children}
          </HeaderBodyWrapper>
          <Footer />
        </PageWrapper>
      </ModalProvider>
    </ThemeProvider>
  );
};

export default function App({ Component, pageProps }: AppProps) {
  const { initialApolloState, initialConfig, hasToken } = pageProps;

  const apolloClient = useApollo(initialApolloState);

  return (
    <ApolloProvider client={apolloClient}>
      <Head>
        <title>ThunderHub - Lightning Node Manager</title>
      </Head>
      <ConfigProvider initialConfig={initialConfig}>
        <BaseProvider initialHasToken={hasToken}>
          <ContextProvider>
            <Wrapper>
              <Component {...pageProps} />
            </Wrapper>
          </ContextProvider>
        </BaseProvider>
      </ConfigProvider>
      <StyledToastContainer />
    </ApolloProvider>
  );
}
