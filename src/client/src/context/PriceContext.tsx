import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  ReactNode,
} from 'react';

type PriceProps = {
  last: number;
  symbol: string;
};

type State = {
  dontShow: boolean;
  fiat: string;
  prices?: { [key: string]: PriceProps };
};

type ChangeState = {
  prices?: { [key: string]: PriceProps };
};

type ActionType =
  | {
      type: 'fetched';
      state: ChangeState;
    }
  | {
      type: 'change' | 'initChange';
      fiat: string;
    }
  | {
      type: 'dontShow';
    };

type Dispatch = (action: ActionType) => void;

export const StateContext = createContext<State | undefined>(undefined);
export const DispatchContext = createContext<Dispatch | undefined>(undefined);

const initialState: State = {
  fiat: 'EUR',
  dontShow: true,
  prices: { EUR: { last: 0, symbol: '€' } },
};

const stateReducer = (state: State, action: ActionType): State => {
  switch (action.type) {
    case 'dontShow':
      return { ...initialState, dontShow: true };
    case 'fetched':
      return { ...state, ...action.state, dontShow: false };
    case 'change': {
      localStorage.setItem('fiat', action.fiat);
      return { ...state, fiat: action.fiat };
    }
    case 'initChange': {
      return { ...state, fiat: action.fiat };
    }
    default:
      return state;
  }
};

const PriceProvider: React.FC<{ children?: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(stateReducer, initialState);

  useEffect(() => {
    const fiat = localStorage.getItem('fiat') || 'EUR';
    dispatch({ type: 'initChange', fiat });
  }, []);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
};

const usePriceState = () => {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error('usePriceState must be used within a PriceProvider');
  }
  return context;
};

const usePriceDispatch = () => {
  const context = useContext(DispatchContext);
  if (context === undefined) {
    throw new Error('usePriceDispatch must be used within a PriceProvider');
  }
  return context;
};

export { PriceProvider, usePriceState, usePriceDispatch };
