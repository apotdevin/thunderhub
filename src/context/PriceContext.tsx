import React, { createContext, useContext, useReducer } from 'react';

type PriceProps = {
  last: number;
  symbol: string;
};

type State = {
  dontShow: boolean;
  prices?: { [key: string]: PriceProps };
};

type ChangeState = {
  prices?: { [key: string]: PriceProps };
};

type ActionType = {
  type: 'fetched' | 'dontShow';
  state?: ChangeState;
};

type Dispatch = (action: ActionType) => void;

export const StateContext = createContext<State | undefined>(undefined);
export const DispatchContext = createContext<Dispatch | undefined>(undefined);

const initialState: State = {
  dontShow: true,
  prices: { EUR: { last: 0, symbol: '€' } },
};

const stateReducer = (state: State, action: ActionType): State => {
  switch (action.type) {
    case 'dontShow':
      return { ...initialState, dontShow: true };
    case 'fetched':
      return { ...initialState, ...action.state, dontShow: false };
    default:
      return state;
  }
};

const PriceProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(stateReducer, initialState);

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
