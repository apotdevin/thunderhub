import React, { createContext, useContext, useReducer } from 'react';

type State = {
  volumeScore: number | null;
  timeScore: number | null;
  feeScore: number | null;
};

type ChangeState = {
  volumeScore?: number;
  timeScore?: number;
  feeScore?: number;
};

type ActionType = {
  type: 'change';
  state?: ChangeState;
};

type Dispatch = (action: ActionType) => void;

const StateContext = createContext<State | undefined>(undefined);
const DispatchContext = createContext<Dispatch | undefined>(undefined);

const initialState = {
  volumeScore: 0,
  timeScore: 0,
  feeScore: 0,
};

const stateReducer = (state: State, action: ActionType): State => {
  switch (action.type) {
    case 'change':
      return { ...state, ...action.state };
    default:
      return state;
  }
};

const StatsProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(stateReducer, initialState);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
};

const useStatsState = () => {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error('useStatsState must be used within a StatsProvider');
  }
  return context;
};

const useStatsDispatch = () => {
  const context = useContext(DispatchContext);
  if (context === undefined) {
    throw new Error('useStatsDispatch must be used within a StatsProvider');
  }
  return context;
};

export { StatsProvider, useStatsState, useStatsDispatch };
