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

const EntryView = React.lazy(() => import('./views/entry/Entry'));
const MainView = React.lazy(() => import('./views/main/Main'));

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
    const { loggedIn, admin, read } = useAccount();

    const renderContent = () => (
        <Suspense fallback={<div>Loading...</div>}>
            {!loggedIn && admin === '' ? (
                <EntryView />
            ) : admin !== '' && read === '' ? (
                <EntryView session={true} />
            ) : (
                <MainView />
            )}
        </Suspense>
    );

    return (
        <ThemeProvider theme={{ mode: theme }}>
            <ModalProvider backgroundComponent={FadingBackground}>
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
