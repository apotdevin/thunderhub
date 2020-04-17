import App from 'next/app';
import React from 'react';
import { ContextProvider } from '../src/context/ContextProvider';
import { ThemeProvider } from 'styled-components';
import { useSettings } from '../src/context/SettingsContext';
import { ModalProvider, BaseModalBackground } from 'styled-react-modal';
import { GlobalStyles } from '../src/styles/GlobalStyle';
import { Header } from '../src/layouts/header/Header';
import { Footer } from '../src/layouts/footer/Footer';
import { ApolloProvider } from '@apollo/react-hooks';
import withApollo from '../config/apolloClient';
import { useAccount } from '../src/context/AccountContext';
import { BitcoinFees } from '../src/components/bitcoinInfo/BitcoinFees';
import { BitcoinPrice } from '../src/components/bitcoinInfo/BitcoinPrice';
import { GridWrapper } from '../src/components/gridWrapper/GridWrapper';
import { useRouter } from 'next/router';
import {
  useConnectionState,
  useConnectionDispatch,
} from '../src/context/ConnectionContext';
import {
  LoadingView,
  ErrorView,
} from '../src/components/stateViews/StateCards';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Head from 'next/head';
import { PageWrapper, HeaderBodyWrapper } from '../src/layouts/Layout.styled';

toast.configure({ draggable: false });

const withoutGrid = ['/', '/login', '/faq', '/privacy', '/terms'];

const Wrapper: React.FC = ({ children }) => {
  const dispatch = useConnectionDispatch();
  const { theme } = useSettings();
  const { loggedIn } = useAccount();
  const { pathname } = useRouter();
  const { loading, error } = useConnectionState();

  const isInArray = withoutGrid.includes(pathname);

  const renderContent = () => {
    if (error && pathname === '/') {
      dispatch({ type: 'disconnected' });
    }
    if ((loading || error) && pathname !== '/') {
      return (
        <GridWrapper>{loading ? <LoadingView /> : <ErrorView />}</GridWrapper>
      );
    }
    return <GridWrapper without={isInArray}>{children}</GridWrapper>;
  };

  const renderGetters = () => (
    <>
      <BitcoinPrice />
      <BitcoinFees />
    </>
  );

  return (
    <ThemeProvider theme={{ mode: theme }}>
      <ModalProvider backgroundComponent={BaseModalBackground}>
        <GlobalStyles />
        {loggedIn && renderGetters()}
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

class MyApp extends App<any> {
  render() {
    const { Component, pageProps, apollo } = this.props;
    return (
      <>
        <Head>
          <title>ThunderHub - Lightning Node Manager</title>
        </Head>
        <ApolloProvider client={apollo}>
          <ContextProvider>
            <Wrapper>
              <Component {...pageProps} />
            </Wrapper>
          </ContextProvider>
        </ApolloProvider>
      </>
    );
  }
}

export default withApollo(MyApp);
