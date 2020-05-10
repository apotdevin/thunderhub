import App from 'next/app';
import React from 'react';
import { ContextProvider } from '../src/context/ContextProvider';
import { ThemeProvider } from 'styled-components';
import { useConfigState } from '../src/context/ConfigContext';
import { ModalProvider, BaseModalBackground } from 'styled-react-modal';
import { GlobalStyles } from '../src/styles/GlobalStyle';
import { Header } from '../src/layouts/header/Header';
import { Footer } from '../src/layouts/footer/Footer';
import { ApolloProvider } from '@apollo/react-hooks';
import withApollo from '../config/apolloClient';
import { BitcoinFees } from '../src/components/bitcoinInfo/BitcoinFees';
import { BitcoinPrice } from '../src/components/bitcoinInfo/BitcoinPrice';
import { GridWrapper } from '../src/components/gridWrapper/GridWrapper';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Head from 'next/head';
import { PageWrapper, HeaderBodyWrapper } from '../src/layouts/Layout.styled';
import { useStatusState } from '../src/context/StatusContext';
import { ChatFetcher } from '../src/components/chat/ChatFetcher';
import { ChatInit } from '../src/components/chat/ChatInit';

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
