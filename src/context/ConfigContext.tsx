import React, { createContext, useContext, useReducer } from 'react';
import getConfig from 'next/config';

const themeTypes = ['dark', 'light'];
const currencyTypes = ['sat', 'btc', 'EUR', 'USD'];

type State = {
  currency: string;
  theme: string;
  sidebar: boolean;
  multiNodeInfo: boolean;
  fetchFees: boolean;
  fetchPrices: boolean;
  displayValues: boolean;
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

const initialState = {
  currency: currencyTypes.indexOf(defC) > -1 ? defC : 'sat',
  theme: themeTypes.indexOf(defT) > -1 ? defT : 'dark',
  sidebar: true,
  multiNodeInfo: false,
  fetchFees,
  fetchPrices,
  displayValues: true,
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

const ConfigProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(stateReducer, initialState);

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
