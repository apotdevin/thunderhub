import * as React from 'react';
import { ThemeProvider } from 'styled-components';
import { ModalProvider, BaseModalBackground } from 'styled-react-modal';
import { useRouter } from 'next/router';
import Head from 'next/head';
import { StyledToastContainer } from 'src/components/toastContainer/ToastContainer';
import { ContextProvider } from '../src/context/ContextProvider';
import { useConfigState, ConfigProvider } from '../src/context/ConfigContext';
import { GlobalStyles } from '../src/styles/GlobalStyle';
import { Header } from '../src/layouts/header/Header';
import { Footer } from '../src/layouts/footer/Footer';
import 'react-toastify/dist/ReactToastify.min.css';
import { PageWrapper, HeaderBodyWrapper } from '../src/layouts/Layout.styled';
import { parseCookies } from '../src/utils/cookies';
import 'react-circular-progressbar/dist/styles.css';
import { NextPage } from 'next';
import App, { AppProps } from 'next/app';

const Wrapper: React.FC = ({ children }) => {
  const { theme } = useConfigState();
  const { pathname } = useRouter();

  const isRoot = pathname === '/';

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

/** Not sure what to do here */
const App: NextPage<AppProps> = ({ Component, pageProps, initialConfig }) => (
  <>
    <Head>
      <title>ThunderHub - Lightning Node Manager</title>
    </Head>
    <ConfigProvider initialConfig={initialConfig}>
      <ContextProvider>
        <Wrapper>
          <Component {...pageProps} />
        </Wrapper>
      </ContextProvider>
    </ConfigProvider>
    <StyledToastContainer />
  </>
);

/** Not sure what to do here */
App.getInitialProps = async ({ req }): Promise<AppProps> => {
  const cookies = parseCookies(req);

  if (!cookies?.theme) {
    return { initialConfig: 'dark' };
  }
  try {
    const initialConfig = cookies.theme || 'dark';
    return { initialConfig };
  } catch (error) {
    return { initialConfig: 'dark' };
  }
};

export default App;
