import React, {
  createContext,
  useContext,
  useReducer,
  ReactNode,
  useEffect,
} from 'react';
import { GatewayInfo } from '../api/types';
import { gatewayApi } from '../api/GatewayApi';

type State = {
  gatewayInfo: GatewayInfo | null;
  loading: boolean;
  error: string | null;
};

type ActionType =
  | {
      type: 'connected';
      state: GatewayInfo;
    }
  | {
      type: 'error';
      state: string;
    };

type Dispatch = (action: ActionType) => void;

export const StateContext = createContext<State | undefined>(undefined);
export const DispatchContext = createContext<Dispatch | undefined>(undefined);

const initialState: State = {
  gatewayInfo: null,
  loading: true,
  error: null,
};

const stateReducer = (state: State, action: ActionType): State => {
  switch (action.type) {
    case 'connected':
      return { ...state, gatewayInfo: action.state, loading: false };
    case 'error':
      return { ...state, error: action.state, loading: false };
    default:
      return state;
  }
};

const GatewayProvider: React.FC<{ children?: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(stateReducer, initialState);

  useEffect(() => {
    gatewayApi
      .fetchInfo()
      .then(info => {
        dispatch({ type: 'connected', state: info });
      })
      .catch(({ error }) => {
        console.log('fetchInfo rejected', error);
        dispatch({ type: 'connected', state: error.message });
      });
  }, []);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
};

const useGatewayState = () => {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error('useGatewayState must be used within a GatewayProvider');
  }
  return context;
};

const useGatewayDispatch = () => {
  const context = useContext(DispatchContext);
  if (context === undefined) {
    throw new Error('useGatewayDispatch must be used within a GatewayProvider');
  }
  return context;
};

export { GatewayProvider, useGatewayState, useGatewayDispatch };
