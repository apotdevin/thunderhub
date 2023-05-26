import React, { ReactNode, createContext, useContext, useReducer } from 'react';

type State = {
  modalType: string;
};

type ActionType = {
  type: 'openModal';
  modalType: string;
};

type Dispatch = (action: ActionType) => void;

export const StateContext = createContext<State | undefined>(undefined);
export const DispatchContext = createContext<Dispatch | undefined>(undefined);

const stateReducer = (state: State, action: ActionType): State => {
  switch (action.type) {
    case 'openModal':
      return { ...state, modalType: action.modalType };
    default:
      return state;
  }
};

const DashProvider: React.FC<{ children?: ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(stateReducer, {
    modalType: '',
  });

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
};

const useDashState = () => {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error('useDashState must be used within a DashProvider');
  }
  return context;
};

const useDashDispatch = () => {
  const context = useContext(DispatchContext);
  if (context === undefined) {
    throw new Error('useDashDispatch must be used within a DashProvider');
  }
  return context;
};

export { DashProvider, useDashState, useDashDispatch };
