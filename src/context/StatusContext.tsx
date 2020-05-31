import React, { createContext, useContext, useReducer } from 'react';

type StateStatus = {
  connected: boolean;
};

type State = {
  alias: string;
  color: string;
  syncedToChain: boolean;
  version: string;
  mayorVersion: number;
  minorVersion: number;
  revision: number;
  chainBalance: number;
  chainPending: number;
  channelBalance: number;
  channelPending: number;
  activeChannelCount: number;
  pendingChannelCount: number;
  closedChannelCount: number;
  peersCount: number;
};

type CompleteState = State & StateStatus;

type ActionType = {
  type: 'connected' | 'disconnected';
  state?: State;
};

type Dispatch = (action: ActionType) => void;

const StateContext = createContext<CompleteState | undefined>(undefined);
const DispatchContext = createContext<Dispatch | undefined>(undefined);

const initialState = {
  connected: false,
  alias: '',
  color: '',
  syncedToChain: false,
  version: '',
  mayorVersion: 0,
  minorVersion: 0,
  revision: 0,
  chainBalance: 0,
  chainPending: 0,
  channelBalance: 0,
  channelPending: 0,
  activeChannelCount: 0,
  pendingChannelCount: 0,
  closedChannelCount: 0,
  peersCount: 0,
};

const stateReducer = (state: State, action: ActionType): CompleteState => {
  switch (action.type) {
    case 'connected':
      return { ...action.state, connected: true } || initialState;
    case 'disconnected':
      return initialState;
    default:
      return initialState;
  }
};

const StatusProvider = ({ children }) => {
  const [state, dispatch] = useReducer(stateReducer, initialState);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
};

const useStatusState = () => {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error('useStatusState must be used within a StatusProvider');
  }
  return context;
};

const useStatusDispatch = () => {
  const context = useContext(DispatchContext);
  if (context === undefined) {
    throw new Error('useStatusDispatch must be used within a StatusProvider');
  }
  return context;
};

export { StatusProvider, useStatusState, useStatusDispatch };
