import React, { createContext, useContext, useReducer, useEffect } from 'react';
import getConfig from 'next/config';
import Cookies from 'js-cookie';

const themeTypes = ['dark', 'light'];
const currencyTypes = ['sat', 'btc', 'EUR', 'USD'];

export type channelBarStyleTypes = 'normal' | 'compact' | 'ultracompact';
export type channelBarTypeTypes = 'balance' | 'details' | 'partner';
export type channelSortTypes = 'none' | 'local' | 'balance';
export type sortDirectionTypes = 'increase' | 'decrease';

type State = {
  currency: string;
  theme: string;
  sidebar: boolean;
  multiNodeInfo: boolean;
  fetchFees: boolean;
  fetchPrices: boolean;
  displayValues: boolean;
  hideFee: boolean;
  hideNonVerified: boolean;
  maxFee: number;
  chatPollingSpeed: number;
  channelBarStyle: channelBarStyleTypes;
  channelBarType: channelBarTypeTypes;
  channelSort: channelSortTypes;
  sortDirection: sortDirectionTypes;
};

type ConfigInitProps = {
  initialConfig: State;
};

type ActionType = {
  type: 'change';
  currency?: string;
  theme?: string;
  sidebar?: boolean;
  multiNodeInfo?: boolean;
  fetchFees?: boolean;
  fetchPrices?: boolean;
  displayValues?: boolean;
  hideFee?: boolean;
  hideNonVerified?: boolean;
  maxFee?: number;
  chatPollingSpeed?: number;
  channelBarStyle?: channelBarStyleTypes;
  channelBarType?: channelBarTypeTypes;
  channelSort?: channelSortTypes;
  sortDirection?: sortDirectionTypes;
};

type Dispatch = (action: ActionType) => void;

const StateContext = createContext<State | undefined>(undefined);
const DispatchContext = createContext<Dispatch | undefined>(undefined);

const { publicRuntimeConfig } = getConfig();
const {
  defaultTheme: defT,
  defaultCurrency: defC,
  fetchPrices,
  fetchFees,
} = publicRuntimeConfig;

const initialState: State = {
  currency: currencyTypes.indexOf(defC) > -1 ? defC : 'sat',
  theme: themeTypes.indexOf(defT) > -1 ? defT : 'dark',
  sidebar: true,
  multiNodeInfo: false,
  fetchFees,
  fetchPrices,
  displayValues: true,
  hideFee: false,
  hideNonVerified: false,
  maxFee: 20,
  chatPollingSpeed: 1000,
  channelBarStyle: 'normal',
  channelBarType: 'balance',
  channelSort: 'none',
  sortDirection: 'decrease',
};

const stateReducer = (state: State, action: ActionType): State => {
  const { type, ...settings } = action;
  switch (type) {
    case 'change':
      return {
        ...state,
        ...settings,
      };
    default:
      return state;
  }
};

const ConfigProvider: React.FC<ConfigInitProps> = ({
  children,
  initialConfig,
}) => {
  const [state, dispatch] = useReducer(stateReducer, {
    ...initialState,
    ...initialConfig,
  });

  useEffect(() => {
    Cookies.set('config', state, { expires: 365, sameSite: 'strict' });
  }, [state]);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
};

const useConfigState = () => {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error('useConfigState must be used within a ConfigProvider');
  }
  return context;
};

const useConfigDispatch = () => {
  const context = useContext(DispatchContext);
  if (context === undefined) {
    throw new Error('useConfigDispatch must be used within a ConfigProvider');
  }
  return context;
};

export { ConfigProvider, useConfigState, useConfigDispatch };
