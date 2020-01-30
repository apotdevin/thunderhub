import React, { Suspense } from 'react';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles } from './styles/GlobalStyle';
import { ApolloProvider } from '@apollo/react-hooks';
import { BrowserRouter } from 'react-router-dom';
import ApolloClient from 'apollo-boost';
import { useSettings, SettingsProvider } from './context/SettingsContext';
import { BitcoinPrice } from './components/bitcoinInfo/BitcoinPrice';
import { ModalProvider } from 'styled-react-modal';
import { useAccount, AccountProvider } from './context/AccountContext';
import { toast } from 'react-toastify';
import { FadingBackground } from './components/modal/ReactModal';
import 'react-toastify/dist/ReactToastify.css';
import { Header } from './sections/header/Header';
import { Footer } from './sections/footer/Footer';
import { BitcoinInfoProvider } from './context/BitcoinContext';
import { BitcoinFees } from './components/bitcoinInfo/BitcoinFees';
import { LoadingCard } from './components/loading/LoadingCard';
import { ScrollToTop } from 'components/scrollToTop/ScrollToTop';

const EntryView = React.lazy(() => import('./views/entry/Entry'));
const ContentView = React.lazy(() => import('./sections/content/Content'));

toast.configure({
    draggable: false,
    pauseOnHover: false,
    hideProgressBar: true,
    closeButton: false,
});

const client = new ApolloClient({
    uri: 'http://localhost:3001',
});

const ContextApp: React.FC = () => {
    const { theme } = useSettings();
    const { loggedIn, admin, read, sessionAdmin } = useAccount();

    const renderContent = () => (
        <Suspense
            fallback={<LoadingCard noCard={true} loadingHeight={'240px'} />}
        >
            {!loggedIn && admin === '' ? (
                <EntryView />
            ) : admin !== '' && read === '' && sessionAdmin === '' ? (
                <EntryView session={true} />
            ) : (
                <ContentView />
            )}
        </Suspense>
    );

    return (
        <ThemeProvider theme={{ mode: theme }}>
            <ModalProvider backgroundComponent={FadingBackground}>
                <ScrollToTop />
                <BitcoinPrice />
                <BitcoinFees />
                <GlobalStyles />
                <Header />
                {renderContent()}
                <Footer />
            </ModalProvider>
        </ThemeProvider>
    );
};

const App: React.FC = () => {
    return (
        <BrowserRouter>
            <ApolloProvider client={client}>
                <AccountProvider>
                    <SettingsProvider>
                        <BitcoinInfoProvider>
                            <ContextApp />
                        </BitcoinInfoProvider>
                    </SettingsProvider>
                </AccountProvider>
            </ApolloProvider>
        </BrowserRouter>
    );
};

export default App;
