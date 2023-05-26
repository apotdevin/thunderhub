import React, { ReactNode, createContext, useContext, useReducer } from 'react';

type State = {
  hasToken: boolean;
};

type ActionType = {
  type: 'change';
  hasToken: boolean;
};

type Dispatch = (action: ActionType) => void;

export const StateContext = createContext<State | undefined>(undefined);
export const DispatchContext = createContext<Dispatch | undefined>(undefined);

const stateReducer = (state: State, action: ActionType): State => {
  switch (action.type) {
    case 'change':
      return { hasToken: action.hasToken };
    default:
      return state;
  }
};

const BaseProvider: React.FC<{
  initialHasToken: boolean;
  children?: ReactNode;
}> = ({ children, initialHasToken = false }) => {
  const [state, dispatch] = useReducer(stateReducer, {
    hasToken: initialHasToken,
  });

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
};

const useBaseState = () => {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error('useBaseState must be used within a BaseProvider');
  }
  return context;
};

const useBaseDispatch = () => {
  const context = useContext(DispatchContext);
  if (context === undefined) {
    throw new Error('useBaseDispatch must be used within a BaseProvider');
  }
  return context;
};

export { BaseProvider, useBaseState, useBaseDispatch };
