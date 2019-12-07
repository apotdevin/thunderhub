import React, { useContext } from 'react';
import styled, { ThemeProvider } from 'styled-components';
import { GlobalStyles } from './styles/GlobalStyle';
import { Header } from './sections/header/Header';
import { Footer } from './sections/footer/Footer';
import { Navigation } from './sections/navigation/Navigation';
import { Content } from './sections/content/Content';
import { ApolloProvider } from '@apollo/react-hooks';
import { BrowserRouter } from 'react-router-dom';
import ApolloClient from 'apollo-boost';
import SettingsProvider, { SettingsContext } from './context/SettingsContext';
import { BitcoinPrice } from './components/bitcoinPrice/BitcoinPrice';
import { ModalProvider } from 'styled-react-modal';
import AccountProvider, { AccountContext } from './context/AccountContext';
import { LoginView } from './views/login/Login';
import { toast } from 'react-toastify';
import { FadingBackground } from './components/modal/ReactModal';
import 'react-toastify/dist/ReactToastify.css';

toast.configure({
    draggable: false,
    pauseOnHover: false,
    hideProgressBar: true,
    closeButton: false,
});

const client = new ApolloClient({
    uri: 'http://localhost:3001',
});

const Wrapper = styled.div`
    max-width: 1000px;
    margin: 0 auto 0 auto;
`;

const Container = styled.div`
    display: grid;
    grid-template-areas:
        'header header header'
        'nav content content'
        'footer footer footer';
    grid-template-columns: 200px 1fr 200px;
    grid-template-rows: auto 1fr auto;
    gap: 10px;
    height: 100vh;
`;

const ContextApp: React.FC = () => {
    const { theme } = useContext(SettingsContext);
    const { loggedIn } = useContext(AccountContext);

    const renderContent = () =>
        loggedIn ? (
            <Container>
                <Header />
                <Navigation />
                <Content />
                <Footer />
            </Container>
        ) : (
            <LoginView />
        );

    return (
        <ThemeProvider theme={{ mode: theme }}>
            <ModalProvider backgroundComponent={FadingBackground}>
                <BitcoinPrice />
                <GlobalStyles />
                <Wrapper>{renderContent()}</Wrapper>
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
                        <ContextApp />
                    </SettingsProvider>
                </AccountProvider>
            </ApolloProvider>
        </BrowserRouter>
    );
};

export default App;
