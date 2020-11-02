import React, { createContext, useContext, useReducer, useEffect } from 'react';
import { toast } from 'react-toastify';
import { CreateBoltzReverseSwap } from './types';

type State = {
  swaps: CreateBoltzReverseSwap[];
  open: number | null;
  claim: number | null;
  claimType: string | null;
  claimTransaction: string | null;
};

type ActionType =
  | {
      type: 'add';
      swap: CreateBoltzReverseSwap;
    }
  | { type: 'init'; swaps: CreateBoltzReverseSwap[] }
  | { type: 'open'; open: number }
  | {
      type: 'claim';
      claim: number;
      claimType: string;
      claimTransaction: string;
    }
  | { type: 'cleanup'; swaps: CreateBoltzReverseSwap[] }
  | { type: 'complete'; index: number; transactionId: string }
  | { type: 'close' };

type Dispatch = (action: ActionType) => void;

export const StateContext = createContext<State | undefined>(undefined);
export const DispatchContext = createContext<Dispatch | undefined>(undefined);

const initialState: State = {
  swaps: [],
  open: null,
  claim: null,
  claimType: null,
  claimTransaction: null,
};

const stateReducer = (state: State, action: ActionType): State => {
  switch (action.type) {
    case 'init':
      return { ...state, swaps: action.swaps };
    case 'add':
      localStorage.setItem(
        'swaps',
        JSON.stringify([...state.swaps, action.swap])
      );
      return { ...state, swaps: [...state.swaps, action.swap] };
    case 'open':
      return { ...state, open: action.open };
    case 'claim':
      return {
        ...state,
        claim: action.claim,
        claimType: action.claimType,
        claimTransaction: action.claimTransaction,
      };
    case 'complete': {
      state.swaps[action.index].claimTransaction = action.transactionId;
      localStorage.setItem('swaps', JSON.stringify(state.swaps));
      return { ...state, open: null, claim: null };
    }
    case 'cleanup':
      localStorage.setItem('swaps', JSON.stringify(action.swaps));
      return { ...state, swaps: action.swaps };
    case 'close':
      return { ...state, open: null, claim: null };
    default:
      return state;
  }
};

const SwapsProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(stateReducer, initialState);

  useEffect(() => {
    try {
      const swaps = JSON.parse(localStorage.getItem('swaps') || '[]');
      dispatch({ type: 'init', swaps });
    } catch (error) {
      toast.error('Invalid swaps stored in browser');
    }
  }, []);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
};

const useSwapsState = () => {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error('useSwapsState must be used within a SwapsProvider');
  }
  return context;
};

const useSwapsDispatch = () => {
  const context = useContext(DispatchContext);
  if (context === undefined) {
    throw new Error('useSwapsDispatch must be used within a SwapsProvider');
  }
  return context;
};

export { SwapsProvider, useSwapsState, useSwapsDispatch };
