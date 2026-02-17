import { FC, ReactNode, useEffect, lazy, Suspense } from 'react';
import { StyleSheetManager, ThemeProvider } from 'styled-components';
import { ApolloProvider } from '@apollo/client';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import Cookies from 'js-cookie';
import isPropValid from '@emotion/is-prop-valid';
import { useApollo } from '../config/client';
import { BaseProvider } from './context/BaseContext';
import { ContextProvider } from './context/ContextProvider';
import { useConfigState, ConfigProvider } from './context/ConfigContext';
import { GlobalStyles } from './styles/GlobalStyle';
import { Header } from './layouts/header/Header';
import { Footer } from './layouts/footer/Footer';
import { PageWrapper, HeaderBodyWrapper } from './layouts/Layout.styled';
import { Toaster } from 'react-hot-toast';
import { useListener } from './hooks/UseListener';
import { SseProvider } from './context/SseContext';
import { config } from './config/thunderhubConfig';
import { LoadingCard } from './components/loading/LoadingCard';
import { useGetNodeInfoQuery } from './graphql/queries/__generated__/getNodeInfo.generated';
import styled from 'styled-components';

import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

// Page imports
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SsoPage from './pages/SsoPage';
import ChannelsPage from './pages/ChannelsPage';
import ChannelDetailPage from './pages/ChannelDetailPage';
import PeersPage from './pages/PeersPage';
import TransactionsPage from './pages/TransactionsPage';
import ForwardsPage from './pages/ForwardsPage';
import ChainPage from './pages/ChainPage';
import ToolsPage from './pages/ToolsPage';
import StatsPage from './pages/StatsPage';
import SwapPage from './pages/SwapPage';
import LeaderboardPage from './pages/LeaderboardPage';
import ChatPage from './pages/ChatPage';
import SettingsPage from './pages/SettingsPage';
import AmbossPage from './pages/AmbossPage';

const DashboardPage = lazy(() => import('./pages/DashboardPage'));
const SettingsDashboardPage = lazy(
  () => import('./pages/SettingsDashboardPage')
);

const LoadingComp = () => <LoadingCard noCard={true} loadingHeight={'90vh'} />;
const LoadingCompSmall = () => (
  <LoadingCard noCard={true} loadingHeight={'30vh'} />
);

const S = {
  wrapper: styled.div`
    position: relative;
  `,
};

function shouldForwardProp(propName: string, target: any) {
  if (typeof target === 'string') {
    return isPropValid(propName);
  }
  return true;
}

const NotAuthenticated: FC = () => {
  const navigate = useNavigate();

  useEffect(() => {
    navigate(config.logoutUrl || '/login');
  }, [navigate]);

  return null;
};

const Listener: FC<{ isRoot: boolean }> = ({ isRoot }) => {
  useListener(isRoot);
  return null;
};

const Wrapper: FC<{ children?: ReactNode }> = ({ children }) => {
  const { theme } = useConfigState();
  const { pathname } = useLocation();

  useEffect(() => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
  }, [theme]);

  const { data, loading, error } = useGetNodeInfoQuery({
    fetchPolicy: 'network-only',
    skip: pathname === '/login' || pathname === '/sso',
  });

  const isRoot = pathname === '/login' || pathname === '/sso';
  const authenticated = !isRoot && !loading && !error && !!data?.getNodeInfo;
  const checking = !isRoot && loading;

  return (
    <ThemeProvider theme={{ mode: isRoot ? 'light' : theme }}>
      <GlobalStyles />
      <PageWrapper>
        <HeaderBodyWrapper>
          <Header />
          <Listener isRoot={isRoot} />
          {checking ? (
            <LoadingCard noCard={true} loadingHeight={'80vh'} />
          ) : isRoot || authenticated ? (
            children
          ) : (
            <NotAuthenticated />
          )}
        </HeaderBodyWrapper>
        <Footer />
        <Toaster position="top-right" />
      </PageWrapper>
    </ThemeProvider>
  );
};

const AuthenticatedRoutes = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route
      path="/dashboard"
      element={
        <Suspense fallback={<LoadingComp />}>
          <S.wrapper>
            <DashboardPage />
          </S.wrapper>
        </Suspense>
      }
    />
    <Route path="/channels" element={<ChannelsPage />} />
    <Route path="/channels/:slug" element={<ChannelDetailPage />} />
    <Route path="/peers" element={<PeersPage />} />
    <Route path="/transactions" element={<TransactionsPage />} />
    <Route path="/forwards" element={<ForwardsPage />} />
    <Route path="/chain" element={<ChainPage />} />
    <Route path="/tools" element={<ToolsPage />} />
    <Route path="/stats" element={<StatsPage />} />
    <Route path="/swap" element={<SwapPage />} />
    <Route path="/leaderboard" element={<LeaderboardPage />} />
    <Route path="/chat" element={<ChatPage />} />
    <Route path="/settings" element={<SettingsPage />} />
    <Route
      path="/settings/dashboard"
      element={
        <Suspense fallback={<LoadingCompSmall />}>
          <SettingsDashboardPage />
        </Suspense>
      }
    />
    <Route path="/amboss" element={<AmbossPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/sso" element={<SsoPage />} />
    <Route path="*" element={<HomePage />} />
  </Routes>
);

export default function App() {
  const themeCookie = Cookies.get('theme') || config.defaultTheme;

  const apolloClient = useApollo('', null);

  return (
    <StyleSheetManager shouldForwardProp={shouldForwardProp}>
      <ApolloProvider client={apolloClient}>
        <ConfigProvider initialConfig={{ theme: themeCookie }}>
          <BaseProvider initialHasToken={false}>
            <SseProvider>
              <ContextProvider>
                <Wrapper>
                  <AuthenticatedRoutes />
                </Wrapper>
              </ContextProvider>
            </SseProvider>
          </BaseProvider>
        </ConfigProvider>
      </ApolloProvider>
    </StyleSheetManager>
  );
}
