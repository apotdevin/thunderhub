import * as React from 'react';
import { ThemeProvider } from 'styled-components';
import { ModalProvider, BaseModalBackground } from 'styled-react-modal';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import Head from 'next/head';
import { ContextProvider } from '../src/context/ContextProvider';
import { useConfigState, ConfigProvider } from '../src/context/ConfigContext';
import { GlobalStyles } from '../src/styles/GlobalStyle';
import { Header } from '../src/layouts/header/Header';
import { Footer } from '../src/layouts/footer/Footer';
import 'react-toastify/dist/ReactToastify.css';
import { PageWrapper, HeaderBodyWrapper } from '../src/layouts/Layout.styled';
import { parseCookies } from '../src/utils/cookies';
import 'react-circular-progressbar/dist/styles.css';

toast.configure({ draggable: false, pauseOnFocusLoss: false });

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

const App = ({ Component, pageProps, initialConfig }) => (
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
  </>
);

App.getInitialProps = async props => {
  const cookies = parseCookies(props.ctx.req);

  if (!cookies?.config) {
    return { initialConfig: {} };
  }
  try {
    const initialConfig = JSON.parse(cookies.config);
    return { initialConfig };
  } catch (error) {
    return { initialConfig: {} };
  }
};

export default App;
