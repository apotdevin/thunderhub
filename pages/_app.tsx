import * as React from 'react';
import { ThemeProvider } from 'styled-components';
import { ModalProvider, BaseModalBackground } from 'styled-react-modal';
import { ApolloProvider } from '@apollo/react-hooks';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import Head from 'next/head';
import { AuthSSOCheck } from 'src/components/accounts/AuthSSOCheck';
import { getUrlParam } from 'src/utils/url';
import { ChatInit } from 'src/components/chat/ChatInit';
import { ServerAccounts } from 'src/components/accounts/ServerAccounts';
import { ContextProvider } from '../src/context/ContextProvider';
import { useConfigState, ConfigProvider } from '../src/context/ConfigContext';
import { GlobalStyles } from '../src/styles/GlobalStyle';
import { Header } from '../src/layouts/header/Header';
import { Footer } from '../src/layouts/footer/Footer';
import withApollo from '../config/apolloClient';
import { BitcoinFees } from '../src/components/bitcoinInfo/BitcoinFees';
import { BitcoinPrice } from '../src/components/bitcoinInfo/BitcoinPrice';
import { GridWrapper } from '../src/components/gridWrapper/GridWrapper';
import 'react-toastify/dist/ReactToastify.css';
import { PageWrapper, HeaderBodyWrapper } from '../src/layouts/Layout.styled';
import { useStatusState } from '../src/context/StatusContext';
import { ChatFetcher } from '../src/components/chat/ChatFetcher';
import { parseCookies } from '../src/utils/cookies';

toast.configure({ draggable: false, pauseOnFocusLoss: false });

const Wrapper: React.FC = ({ children }) => {
  const { theme } = useConfigState();
  const { pathname } = useRouter();
  const { connected } = useStatusState();

  const isRoot = pathname === '/';

  const renderContent = () => {
    if (isRoot) {
      return <>{children}</>;
    }
    return <GridWrapper>{children}</GridWrapper>;
  };

  const renderGetters = () => (
    <>
      <BitcoinPrice />
      <BitcoinFees />
      <ChatFetcher />
      <ChatInit />
    </>
  );

  return (
    <ThemeProvider theme={{ mode: isRoot ? 'light' : theme }}>
      <ModalProvider backgroundComponent={BaseModalBackground}>
        <GlobalStyles />
        {connected && !isRoot && renderGetters()}
        <PageWrapper>
          <HeaderBodyWrapper>
            <Header />
            {renderContent()}
          </HeaderBodyWrapper>
          <Footer />
        </PageWrapper>
      </ModalProvider>
    </ThemeProvider>
  );
};

const App = ({
  Component,
  pageProps,
  apollo,
  initialConfig,
  cookieParam,
}: any) => (
  <>
    <Head>
      <title>ThunderHub - Lightning Node Manager</title>
    </Head>
    <ApolloProvider client={apollo}>
      <ConfigProvider initialConfig={initialConfig}>
        <ContextProvider>
          <AuthSSOCheck cookieParam={cookieParam} />
          <ServerAccounts />
          <Wrapper>
            <Component {...pageProps} />
          </Wrapper>
        </ContextProvider>
      </ConfigProvider>
    </ApolloProvider>
  </>
);

App.getInitialProps = async props => {
  const cookieParam = getUrlParam(props.router?.query?.token);

  const cookies = parseCookies(props.ctx.req);

  const ssoVerified = !!cookies?.['SSOAuth'];
  const defaultState = { ssoVerified };

  if (!cookies?.config) {
    return { initialConfig: {}, ...defaultState };
  }
  try {
    const config = JSON.parse(cookies.config);
    return {
      initialConfig: { ...config, ...defaultState },
      cookieParam,
    };
  } catch (error) {
    return { initialConfig: {}, cookieParam, ...defaultState };
  }
};

export default withApollo(App);
