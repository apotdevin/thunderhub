import { FC, ReactNode, useEffect, lazy, Suspense } from 'react';
import { ApolloProvider } from '@apollo/client';
import {
  Routes,
  Route,
  useNavigate,
  useLocation,
  Navigate,
  Outlet,
} from 'react-router-dom';
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
import { useGetAccountQuery } from './graphql/queries/__generated__/getAccount.generated';
import { Navigation } from './layouts/navigation/Navigation';
import { RightSidebar } from './layouts/sidebar/RightSidebar';
import { TradingProvider } from './context/TradingContext';
import { NodeSlugProvider } from './hooks/useNodeSlug';
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
import SwapPage from './pages/SwapPage';
import SettingsPage from './pages/SettingsPage';
import AmbossPage from './pages/AmbossPage';
import AssetsPage from './pages/AssetsPage';
import AssetChannelsPage from './pages/AssetChannelsPage';
import AssetTransactionsPage from './pages/AssetTransactionsPage';
import AssetToolsPage from './pages/AssetToolsPage';
import TradingPage from './pages/TradingPage';
import MagmaPage from './pages/MagmaPage';
import SetupPage from './pages/SetupPage';
import NodeSetupPage from './pages/NodeSetupPage';

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
    if (config.needsSetup) {
      navigate('/setup');
    } else {
      navigate(config.logoutUrl || '/login');
    }
  }, [navigate]);

  return null;
};

const Listener: FC<{ isRoot: boolean }> = ({ isRoot }) => {
  useListener(isRoot);
  return null;
};

/**
 * Redirects bare paths (e.g. /channels) to the node-scoped path (e.g. /my-node/channels).
 * If not authenticated, redirects to /login.
 */
const LegacyRedirect: FC = () => {
  const { pathname } = useLocation();
  const { data, loading, error } = useGetAccountQuery({
    fetchPolicy: 'cache-first',
  });

  if (loading) return <LoadingCard noCard={true} loadingHeight={'80vh'} />;

  if (error || !data?.getAccount?.slug) {
    return <Navigate to="/login" replace />;
  }

  return <Navigate to={`/${data.getAccount.slug}${pathname}`} replace />;
};

/**
 * Redirects / to /<nodeSlug>/ if authenticated, or /login if not.
 */
const RootRedirect: FC = () => {
  const { data, loading, error } = useGetAccountQuery({
    fetchPolicy: 'cache-first',
  });

  if (loading) return <LoadingCard noCard={true} loadingHeight={'80vh'} />;

  if (error || !data?.getAccount?.slug) {
    if (config.needsSetup) return <Navigate to="/setup" replace />;
    return <Navigate to="/login" replace />;
  }

  if (data.getAccount.hasNode === false) {
    return <Navigate to="/node-setup" replace />;
  }

  return <Navigate to={`/${data.getAccount.slug}/home`} replace />;
};

const NodeScopedLayout: FC = () => {
  return (
    <NodeSlugProvider>
      <Wrapper>
        <Outlet />
      </Wrapper>
    </NodeSlugProvider>
  );
};

const PublicLayout: FC = () => {
  return (
    <Wrapper>
      <Outlet />
    </Wrapper>
  );
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

  const isRoot =
    pathname === '/login' ||
    pathname === '/sso' ||
    pathname === '/setup' ||
    pathname === '/node-setup';

  const { data, loading, error } = useGetNodeInfoQuery({
    fetchPolicy: 'cache-and-network',
    skip: isRoot,
  });
  const hasData = !!data?.getNodeInfo;
  const authenticated = !isRoot && !error && hasData;
  const checking = !isRoot && loading && !hasData;

  return (
    <div className="relative min-h-screen">
      <div className="pb-30">
        {!isRoot && <Header />}
        <Listener isRoot={isRoot} />
        <TradingProvider>
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
        </TradingProvider>
      </div>
      <Footer />
      <Toaster
        position="top-right"
        toastOptions={{ style: { wordBreak: 'break-word' } }}
      />
    </div>
  );
};

const AUTHENTICATED_ROUTES = (
  <>
    <Route index element={<Navigate to="home" replace />} />
    <Route path="home" element={<HomePage />} />
    <Route
      path="dashboard"
      element={
        <Suspense fallback={<LoadingComp />}>
          <div className="relative">
            <DashboardPage />
          </div>
        </Suspense>
      }
    />
    <Route path="channels" element={<ChannelsPage />} />
    <Route path="channels/pending" element={<ChannelsPage />} />
    <Route path="channels/closed" element={<ChannelsPage />} />
    <Route path="peers" element={<PeersPage />} />
    <Route path="transactions" element={<TransactionsPage />} />
    <Route path="forwards" element={<ForwardsPage />} />
    <Route path="chain" element={<ChainPage />} />
    <Route path="tools" element={<ToolsPage />} />
    <Route path="swap" element={<SwapPage />} />
    <Route path="settings" element={<SettingsPage />} />
    <Route
      path="settings/dashboard"
      element={
        <Suspense fallback={<LoadingCompSmall />}>
          <SettingsDashboardPage />
        </Suspense>
      }
    />
    <Route path="amboss" element={<AmbossPage />} />
    <Route path="assets" element={<AssetsPage />} />
    <Route path="asset-channels" element={<AssetChannelsPage />} />
    <Route path="asset-channels/pending" element={<AssetChannelsPage />} />
    <Route path="asset-transactions" element={<AssetTransactionsPage />} />
    <Route path="asset-tools" element={<AssetToolsPage />} />
    <Route path="trading" element={<TradingPage />} />
    <Route path="magma" element={<MagmaPage />} />
    <Route path="magma/sales" element={<MagmaPage />} />
    <Route path="*" element={<Navigate to="home" replace />} />
  </>
);

/** Legacy bare paths redirect to node-scoped equivalents */
const LEGACY_PATHS = [
  'home',
  'dashboard',
  'channels',
  'channels/pending',
  'channels/closed',
  'peers',
  'transactions',
  'forwards',
  'chain',
  'tools',
  'swap',
  'settings',
  'settings/dashboard',
  'amboss',
  'assets',
  'asset-channels',
  'asset-channels/pending',
  'asset-transactions',
  'asset-tools',
  'trading',
  'magma',
  'magma/sales',
];

const AppRoutes = () => (
  <Routes>
    {/* Public routes */}
    <Route element={<PublicLayout />}>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/sso" element={<SsoPage />} />
      <Route path="/setup" element={<SetupPage />} />
      <Route path="/node-setup" element={<NodeSetupPage />} />
    </Route>

    {/* Legacy bare paths → redirect to /:nodeSlug/path */}
    {LEGACY_PATHS.map(p => (
      <Route key={p} path={`/${p}`} element={<LegacyRedirect />} />
    ))}

    {/* Node-scoped routes */}
    <Route path="/:nodeSlug" element={<NodeScopedLayout />}>
      {AUTHENTICATED_ROUTES}
    </Route>

    {/* Root → redirect to /:nodeSlug/ or /login */}
    <Route path="/" element={<RootRedirect />} />
    <Route path="*" element={<RootRedirect />} />
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
                  <AppRoutes />
                </TooltipProvider>
              </EventLogProvider>
            </ContextProvider>
          </SseProvider>
        </ConfigProvider>
      </ApolloProvider>
    </ErrorBoundary>
  );
}
