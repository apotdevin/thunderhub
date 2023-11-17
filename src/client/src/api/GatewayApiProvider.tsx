import React from 'react';
import { GatewayApi } from './GatewayApi';

interface ApiContextProps {
  // API to interact with the Gateway server
  gateway: GatewayApi;
}

export const ApiContext = React.createContext<ApiContextProps>({
  gateway: new GatewayApi(),
});

export const ApiProvider = React.memo(function ApiProvider({
  props,
  children,
}: {
  props: ApiContextProps;
  children: React.ReactNode;
}): JSX.Element {
  return <ApiContext.Provider value={props}>{children}</ApiContext.Provider>;
});
