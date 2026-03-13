import {
  FC,
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from 'react';
import { omit } from 'lodash';
import { config } from '../config/thunderhubConfig';

const themeTypes = ['dark', 'light', 'system'];
const currencyTypes = ['sat', 'btc', 'fiat'];

export type channelBarStyleTypes =
  | 'normal'
  | 'compact'
  | 'ultracompact'
  | 'balancing';
export type channelBarTypeTypes =
  | 'balance'
  | 'fees'
  | 'size'
  | 'proportional'
  | 'htlcs';
export type channelSortTypes =
  | 'none'
  | 'age'
  | 'local'
  | 'balance'
  | 'deviation'
  | 'feeRate'
  | 'partnerName'
  | 'size';
export type sortDirectionTypes = 'increase' | 'decrease';
export type extraColumnsType = 'outgoing' | 'incoming' | 'both' | 'none';
export type maxSatValueType = 'auto' | 1000000 | 5000000 | 10000000 | 16777215;

type State = {
  currency: string;
  theme: string;
  sidebar: boolean;
  rightSidebar: boolean;
  fetchFees: boolean;
  fetchPrices: boolean;
  displayValues: boolean;
  channelBarStyle: channelBarStyleTypes;
  channelBarType: channelBarTypeTypes;
  channelSort: channelSortTypes;
  sortDirection: sortDirectionTypes;
  extraColumns: extraColumnsType;
  maxSatValue: maxSatValueType;
};

type ConfigInitProps = {
  initialConfig: { theme: string };
  children?: ReactNode;
};

type ActionType =
  | {
      type: 'change' | 'initChange';
      currency?: string;
      theme?: string;
      sidebar?: boolean;
      rightSidebar?: boolean;
      fetchFees?: boolean;
      fetchPrices?: boolean;
      displayValues?: boolean;
      channelBarStyle?: channelBarStyleTypes;
      channelBarType?: channelBarTypeTypes;
      channelSort?: channelSortTypes;
      sortDirection?: sortDirectionTypes;
      extraColumns?: extraColumnsType;
      maxSatValue?: maxSatValueType;
    }
  | { type: 'themeChange'; theme: string };

type Dispatch = (action: ActionType) => void;

const StateContext = createContext<State | undefined>(undefined);
const DispatchContext = createContext<Dispatch | undefined>(undefined);

const getInitialState = (): State => {
  const { defaultTheme: defT, defaultCurrency: defC } = config;
  return {
    currency: currencyTypes.indexOf(defC) > -1 ? defC : 'sat',
    theme: themeTypes.indexOf(defT) > -1 ? defT : 'dark',
    sidebar: true,
    rightSidebar: true,
    fetchFees: config.fetchFees,
    fetchPrices: config.fetchPrices,
    displayValues: true,
    channelBarStyle: 'normal',
    channelBarType: 'balance',
    channelSort: 'none',
    sortDirection: 'decrease',
    extraColumns: 'none',
    maxSatValue: 'auto',
  };
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
      if (settings.theme) {
        localStorage.setItem('theme', settings.theme);
        return {
          ...state,
          theme: settings.theme,
        };
      }
      return state;
    }
    default:
      return state;
  }
};

const ConfigProvider: FC<ConfigInitProps> = ({
  children,
  initialConfig = { theme: 'dark' },
}) => {
  const [state, dispatch] = useReducer(stateReducer, {
    ...getInitialState(),
    theme:
      themeTypes.indexOf(initialConfig.theme) > -1
        ? initialConfig.theme
        : 'dark',
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
