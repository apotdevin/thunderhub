import React, { Suspense } from 'react';
import { ThemeProvider } from 'styled-components';
import { GlobalStyles } from './styles/GlobalStyle';
import { ApolloProvider } from '@apollo/react-hooks';
import { BrowserRouter } from 'react-router-dom';
import ApolloClient from 'apollo-boost';
import { useSettings } from './context/SettingsContext';
import { ModalProvider } from 'styled-react-modal';
import { useAccount } from './context/AccountContext';
import { toast } from 'react-toastify';
import { FadingBackground } from './components/modal/ReactModal';
import 'react-toastify/dist/ReactToastify.css';
import { Header } from './sections/header/Header';
import { Footer } from './sections/footer/Footer';
import { LoadingCard } from './components/loading/LoadingCard';
import { ScrollToTop } from 'components/scrollToTop/ScrollToTop';
import { ContextProvider } from 'context/ContextProvider';
import { ConnectionCheck } from 'components/connectionCheck/ConnectionCheck';
import { StatusCheck } from 'components/statusCheck/StatusCheck';

const EntryView = React.lazy(() => import('./views/entry/Entry'));
const ContentView = React.lazy(() => import('./sections/content/Content'));

toast.configure({ draggable: false });

const client = new ApolloClient({
    uri:
        process.env.NODE_ENV === 'development'
            ? 'http://localhost:3001'
            : 'https://api.thunderhub.io/',
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
                <>
                    <ConnectionCheck />
                    <StatusCheck />
                    <ContentView />
                </>
            )}
        </Suspense>
    );

    return (
        <ThemeProvider theme={{ mode: theme }}>
            <ModalProvider backgroundComponent={FadingBackground}>
                <ScrollToTop />
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
                <ContextProvider>
                    <ContextApp />
                </ContextProvider>
            </ApolloProvider>
        </BrowserRouter>
    );
};

export default App;
