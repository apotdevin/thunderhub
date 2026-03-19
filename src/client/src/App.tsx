import { FC, ReactNode, useEffect, lazy, Suspense } from 'react';
import { ApolloProvider } from '@apollo/client';
import { Routes, Route, useNavigate, useLocation } from 'react-router-dom';
import { useApollo } from '../config/client';
import { ContextProvider } from './context/ContextProvider';
import { useConfigState, ConfigProvider } from './context/ConfigContext';
import { Header } from './layouts/header/Header';
import { Footer } from './layouts/footer/Footer';
import { Toaster } from 'react-hot-toast';
import { TooltipProvider } from './components/ui/tooltip';
import { useListener } from './hooks/UseListener';
import { SseProvider } from './context/SseContext';
import { EventLogProvider } from './context/EventLogContext';
import { config } from './config/thunderhubConfig';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingCard } from './components/loading/LoadingCard';
import { useGetNodeInfoQuery } from './graphql/queries/__generated__/getNodeInfo.generated';
import { Navigation } from './layouts/navigation/Navigation';
import { RightSidebar } from './layouts/sidebar/RightSidebar';
import 'react-grid-layout/css/styles.css';
import 'react-resizable/css/styles.css';

// Page imports
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SsoPage from './pages/SsoPage';
import ChannelsPage from './pages/ChannelsPage';
import PeersPage from './pages/PeersPage';
import TransactionsPage from './pages/TransactionsPage';
import ForwardsPage from './pages/ForwardsPage';
import ChainPage from './pages/ChainPage';
import ToolsPage from './pages/ToolsPage';
import StatsPage from './pages/StatsPage';
import SwapPage from './pages/SwapPage';
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
    const applyTheme = (resolved: 'dark' | 'light') => {
      document.documentElement.classList.toggle('dark', resolved === 'dark');
    };

    if (theme === 'system') {
      const mq = window.matchMedia('(prefers-color-scheme: dark)');
      applyTheme(mq.matches ? 'dark' : 'light');
      const handler = (e: MediaQueryListEvent) =>
        applyTheme(e.matches ? 'dark' : 'light');
      mq.addEventListener('change', handler);
      return () => mq.removeEventListener('change', handler);
    }

    applyTheme(theme === 'dark' ? 'dark' : 'light');
  }, [theme]);

  const { data, loading, error } = useGetNodeInfoQuery({
    fetchPolicy: 'network-only',
    skip: pathname === '/login' || pathname === '/sso',
  });

  const isRoot = pathname === '/login' || pathname === '/sso';
  const authenticated = !isRoot && !loading && !error && !!data?.getNodeInfo;
  const checking = !isRoot && loading;

  return (
    <div className="relative min-h-screen">
      <div className="pb-[120px]">
        {!isRoot && <Header />}
        <Listener isRoot={isRoot} />
        <div className="flex">
          {!isRoot && authenticated && <Navigation />}
          <div className="flex-1 min-w-0 overflow-hidden bg-muted/20 dark:bg-transparent">
            {checking ? (
              <LoadingCard noCard={true} loadingHeight={'80vh'} />
            ) : isRoot || authenticated ? (
              children
            ) : (
              <NotAuthenticated />
            )}
          </div>
          {!isRoot && authenticated && <RightSidebar />}
        </div>
      </div>
      <Footer />
      <Toaster position="top-right" />
    </div>
  );
};

const AuthenticatedRoutes = () => (
  <Routes>
    <Route path="/" element={<HomePage />} />
    <Route
      path="/dashboard"
      element={
        <Suspense fallback={<LoadingComp />}>
          <div className="relative">
            <DashboardPage />
          </div>
        </Suspense>
      }
    />
    <Route path="/channels" element={<ChannelsPage />} />
    <Route path="/channels/pending" element={<ChannelsPage />} />
    <Route path="/channels/closed" element={<ChannelsPage />} />
    <Route path="/peers" element={<PeersPage />} />
    <Route path="/transactions" element={<TransactionsPage />} />
    <Route path="/forwards" element={<ForwardsPage />} />
    <Route path="/chain" element={<ChainPage />} />
    <Route path="/tools" element={<ToolsPage />} />
    <Route path="/stats" element={<StatsPage />} />
    <Route path="/swap" element={<SwapPage />} />
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
  const savedTheme = localStorage.getItem('theme') || config.defaultTheme;

  const apolloClient = useApollo('', null);

  return (
    <ErrorBoundary>
      <ApolloProvider client={apolloClient}>
        <ConfigProvider initialConfig={{ theme: savedTheme }}>
          <SseProvider>
            <ContextProvider>
              <EventLogProvider>
                <TooltipProvider>
                  <Wrapper>
                    <AuthenticatedRoutes />
                  </Wrapper>
                </TooltipProvider>
              </EventLogProvider>
            </ContextProvider>
          </SseProvider>
        </ConfigProvider>
      </ApolloProvider>
    </ErrorBoundary>
  );
}
