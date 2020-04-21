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
import { LoadingView } from '../src/components/stateViews/StateCards';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Head from 'next/head';
import { PageWrapper, HeaderBodyWrapper } from '../src/layouts/Layout.styled';
import ContextApp from '.';
import { useStatusState } from '../src/context/StatusContext';

toast.configure({ draggable: false, pauseOnFocusLoss: false });

const Wrapper: React.FC = ({ children }) => {
  const { push } = useRouter();
  const { theme } = useSettings();
  const { loggedIn, name } = useAccount();
  const { pathname } = useRouter();
  const { error } = useStatusState();

  const isRoot = pathname === '/';

  const renderContent = () => {
    if (error) {
      if (!isRoot) {
        toast.error(`Unable to connect to ${name}`);
      }
      return <ContextApp hasError={true} />;
    }
    // if (loading && !isRoot) {
    //   return (
    //     <GridWrapper>
    //       <LoadingView />
    //     </GridWrapper>
    //   );
    // }
    return <GridWrapper without={isRoot}>{children}</GridWrapper>;
  };

  const renderGetters = () => (
    <>
      <BitcoinPrice />
      <BitcoinFees />
    </>
  );

  return (
    <ThemeProvider theme={{ mode: isRoot ? 'light' : theme }}>
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
