import React, { createContext, useContext, useReducer, useEffect } from 'react';
import getConfig from 'next/config';
import Cookies from 'js-cookie';
import omit from 'lodash.omit';

const themeTypes = ['dark', 'light'];
const currencyTypes = ['sat', 'btc', 'fiat'];

export type channelBarStyleTypes = 'normal' | 'compact' | 'ultracompact';
export type channelBarTypeTypes = 'balance' | 'fees' | 'size' | 'proportional';
export type channelSortTypes =
  | 'none'
  | 'local'
  | 'balance'
  | 'feeRate'
  | 'partnerName'
  | 'size';
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
  initialConfig: string;
};

type ActionType =
  | {
      type: 'change' | 'initChange';
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
    }
  | { type: 'themeChange'; theme: string };

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
    case 'initChange': {
      return {
        ...state,
        ...settings,
      };
    }
    case 'change': {
      const newState = {
        ...state,
        ...settings,
      };
      localStorage.setItem('config', JSON.stringify(omit(newState, 'theme')));
      return newState;
    }
    case 'themeChange': {
      Cookies.set('theme', action.theme, { expires: 365, sameSite: 'strict' });
      return {
        ...state,
        theme: action.theme,
      };
    }
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
    theme: themeTypes.indexOf(initialConfig) > -1 ? initialConfig : 'dark',
  });

  useEffect(() => {
    const savedConfig = JSON.parse(localStorage.getItem('config') || '{}');
    dispatch({ type: 'initChange', ...savedConfig });
  }, []);

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
