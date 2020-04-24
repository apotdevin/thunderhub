import React, { createContext, useContext, useReducer } from 'react';

type ChatProps = {
  date?: string;
  contentType?: string;
  alias?: string;
  message?: string;
  id?: string;
  sender?: string;
};

type State = {
  initialized: boolean;
  chats: ChatProps[];
  lastChat: string;
};

type CompleteState = State;

type ActionType = {
  type: 'initialized' | 'additional';
  chats: ChatProps[];
  lastChat: string;
};

type Dispatch = (action: ActionType) => void;

const StateContext = createContext<CompleteState | undefined>(undefined);
const DispatchContext = createContext<Dispatch | undefined>(undefined);

const initialState = {
  initialized: false,
  chats: [],
  lastChat: '',
};

const stateReducer = (state: State, action: ActionType): CompleteState => {
  switch (action.type) {
    case 'initialized':
      return {
        initialized: true,
        ...action,
      };
    case 'additional':
      return {
        initialized: true,
        chats: [...state.chats, ...action.chats],
        lastChat: action.lastChat,
      };
    //       return (
    //         { ...action.state, loading: false, connected: true } || initialState
    //       );
    //     case 'disconnected':
    //       return initialState;
    //     case 'loading':
    //       return { ...initialState, loading: true };
    default:
      return initialState;
  }
};

const ChatProvider = ({ children }: any) => {
  const [state, dispatch] = useReducer(stateReducer, initialState);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
};

const useChatState = () => {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error('useStatusState must be used within a StatusProvider');
  }
  return context;
};

const useChatDispatch = () => {
  const context = useContext(DispatchContext);
  if (context === undefined) {
    throw new Error('useStatusDispatch must be used within a StatusProvider');
  }
  return context;
};

export { ChatProvider, useChatState, useChatDispatch };
