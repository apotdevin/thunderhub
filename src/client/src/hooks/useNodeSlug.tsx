import {
  createContext,
  useContext,
  useEffect,
  useRef,
  FC,
  ReactNode,
  useMemo,
  useCallback,
} from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { useApolloClient } from '@apollo/client';

interface NodeSlugContextType {
  nodeSlug: string;
  buildPath: (path: string) => string;
  navigateToNode: (path: string) => void;
}

const NodeSlugContext = createContext<NodeSlugContextType>({
  nodeSlug: '',
  buildPath: (p: string) => p,
  navigateToNode: () => {},
});

export const NodeSlugProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const { nodeSlug = '' } = useParams<{ nodeSlug: string }>();
  const navigate = useNavigate();
  const client = useApolloClient();
  const prevSlug = useRef(nodeSlug);

  useEffect(() => {
    if (prevSlug.current && nodeSlug && prevSlug.current !== nodeSlug) {
      client.resetStore();
    }
    prevSlug.current = nodeSlug;
  }, [nodeSlug, client]);

  const buildPath = useCallback(
    (path: string) => {
      if (!nodeSlug) return path;
      const clean = path.startsWith('/') ? path : `/${path}`;
      return `/${nodeSlug}${clean}`;
    },
    [nodeSlug]
  );

  const navigateToNode = useCallback(
    (path: string) => {
      navigate(buildPath(path));
    },
    [navigate, buildPath]
  );

  const value = useMemo(
    () => ({ nodeSlug, buildPath, navigateToNode }),
    [nodeSlug, buildPath, navigateToNode]
  );

  return (
    <NodeSlugContext.Provider value={value}>
      {children}
    </NodeSlugContext.Provider>
  );
};

export const useNodeSlug = () => useContext(NodeSlugContext);

/**
 * Extracts the current page path (without the node slug prefix) from the full pathname.
 */
export const useNodePath = (): string => {
  const { nodeSlug } = useNodeSlug();
  const { pathname } = useLocation();

  if (!nodeSlug) return pathname;
  const prefix = `/${nodeSlug}`;
  if (pathname.startsWith(prefix)) {
    return pathname.slice(prefix.length) || '/';
  }
  return pathname;
};
