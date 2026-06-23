import { FC, ReactNode } from 'react';
import { Navigate } from 'react-router-dom';
import { useNodeSlug } from '../hooks/useNodeSlug';
import { useTapdAvailable } from '../hooks/useTapdAvailable';

/**
 * Route guard for Taproot Assets pages. A node without the Taproot Assets
 * capability cannot use these features, so direct navigation (typed URL or
 * bookmark) is redirected to home — mirroring the hidden navigation section.
 * Rendering is held until the capability query resolves to avoid a false
 * redirect on first load.
 */
export const RequireTapd: FC<{ children: ReactNode }> = ({ children }) => {
  const { available, loading } = useTapdAvailable();
  const { buildPath } = useNodeSlug();

  if (loading) return null;
  if (!available) return <Navigate to={buildPath('home')} replace />;
  return <>{children}</>;
};
