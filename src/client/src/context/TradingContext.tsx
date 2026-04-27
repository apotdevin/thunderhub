import { FC, ReactNode, createContext, useContext, useReducer } from 'react';
import { TapTransactionType } from '../graphql/types';

export type TradingOffer = {
  id: string;
  magmaOfferId: string;
  node: { alias?: string | null; pubkey?: string | null; sockets: string[] };
  rate: { displayAmount?: string | null; fullAmount?: string | null };
  available: { displayAmount?: string | null; fullAmount?: string | null };
  minOrder: { displayAmount?: string | null; fullAmount?: string | null };
  maxOrder: { displayAmount?: string | null; fullAmount?: string | null };
  fees: { baseFeeSats: number; feeRatePpm: number };
  asset: {
    id: string;
    symbol: string;
    precision: number;
    assetId?: string | null;
    groupKey?: string | null;
  };
};

export type TradingAsset = {
  id: string;
  symbol: string;
  precision: number;
  assetId?: string | null;
  groupKey?: string | null;
};

type TradingState = {
  selectedAsset: TradingAsset | null;
  txType: TapTransactionType;
  selectedOffer: TradingOffer | null;
};

type TradingAction =
  | { type: 'selectAsset'; asset: TradingAsset | null }
  | { type: 'setTxType'; txType: TapTransactionType }
  | { type: 'selectOffer'; offer: TradingOffer | null }
  | { type: 'reset' };

const initialState: TradingState = {
  selectedAsset: null,
  txType: TapTransactionType.Sale,
  selectedOffer: null,
};

function reducer(state: TradingState, action: TradingAction): TradingState {
  switch (action.type) {
    case 'selectAsset':
      return { ...state, selectedAsset: action.asset, selectedOffer: null };
    case 'setTxType':
      return { ...state, txType: action.txType };
    case 'selectOffer':
      return { ...state, selectedOffer: action.offer };
    case 'reset':
      return initialState;
    default:
      return state;
  }
}

const StateContext = createContext<TradingState | undefined>(undefined);
const DispatchContext = createContext<
  React.Dispatch<TradingAction> | undefined
>(undefined);

export const TradingProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, initialState);

  return (
    <StateContext.Provider value={state}>
      <DispatchContext.Provider value={dispatch}>
        {children}
      </DispatchContext.Provider>
    </StateContext.Provider>
  );
};

export const useTradingState = (): TradingState => {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error('useTradingState must be used within a TradingProvider');
  }
  return context;
};

export const useTradingDispatch = (): React.Dispatch<TradingAction> => {
  const context = useContext(DispatchContext);
  if (context === undefined) {
    throw new Error('useTradingDispatch must be used within a TradingProvider');
  }
  return context;
};
