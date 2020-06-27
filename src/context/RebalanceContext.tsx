import React, { createContext, useContext, useReducer } from 'react';
import { ChannelType } from 'src/graphql/types';

type State = {
  inChannel: ChannelType | null;
  outChannel: ChannelType | null;
};

type ActionType =
  | {
      type: 'setIn';
      channel: ChannelType | null;
    }
  | {
      type: 'setOut';
      channel: ChannelType | null;
    }
  | {
      type: 'clear';
    };

type Dispatch = (action: ActionType) => void;

export const StateContext = createContext<State | undefined>(undefined);
export const DispatchContext = createContext<Dispatch | undefined>(undefined);

const initialState = {
  inChannel: null,
  outChannel: null,
};

const stateReducer = (state: State, action: ActionType): State => {
  switch (action.type) {
    case 'setIn':
      return { ...state, inChannel: action.channel };
    case 'setOut':
      return { ...state, outChannel: action.channel };
    case 'clear':
      return initialState;
    default:
      return state;
  }
};

const RebalanceProvider = ({ children }) => {
  const [state, dispatch] = useReducer(stateReducer, initialState);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
};

const useRebalanceState = () => {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error(
      'useRebalanceState must be used within a RebalanceProvider'
    );
  }
  return context;
};

const useRebalanceDispatch = () => {
  const context = useContext(DispatchContext);
  if (context === undefined) {
    throw new Error(
      'useRebalanceDispatch must be used within a RebalanceProvider'
    );
  }
  return context;
};

export { RebalanceProvider, useRebalanceState, useRebalanceDispatch };
