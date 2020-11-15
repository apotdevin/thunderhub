import { FC, createContext, useContext, useReducer } from 'react';

type ReportType = 'fee' | 'tokens' | 'amount';

type State = {
  days: number;
  infoType: ReportType;
};

type ActionType =
  | {
      type: 'day';
      days: number;
    }
  | {
      type: 'infoType';
      infoType: ReportType;
    };

type Dispatch = (action: ActionType) => void;

export const StateContext = createContext<State | undefined>(undefined);
export const DispatchContext = createContext<Dispatch | undefined>(undefined);

const initialState: State = {
  days: 30,
  infoType: 'amount',
};

const stateReducer = (state: State, action: ActionType): State => {
  switch (action.type) {
    case 'day':
      return { ...state, days: action.days };
    case 'infoType':
      return { ...state, infoType: action.infoType };
    default:
      return state;
  }
};

const ForwardProvider: FC = ({ children }) => {
  const [state, dispatch] = useReducer(stateReducer, initialState);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
};

const useForwardState = () => {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error('useForwardState must be used within a ForwardProvider');
  }
  return context;
};

const useForwardDispatch = () => {
  const context = useContext(DispatchContext);
  if (context === undefined) {
    throw new Error('useForwardDispatch must be used within a ForwardProvider');
  }
  return context;
};

export { ForwardProvider, useForwardState, useForwardDispatch };
