import React, { createContext, useContext, useReducer } from 'react';

type ChatProps = {
  date?: string;
  contentType?: string;
  alias?: string;
  message?: string;
  id?: string;
  sender?: string;
};

type SentChatProps = {
  date?: string;
  contentType?: string;
  alias?: string;
  message?: string;
  id?: string;
  sender?: string;
  isSent?: boolean;
};

type State = {
  initialized: boolean;
  chats: ChatProps[];
  sentChats: SentChatProps[];
  lastChat: string;
  sender: string;
};

type ActionType = {
  type: 'initialized' | 'additional' | 'changeActive' | 'newChat';
  chats?: ChatProps[];
  sentChats?: SentChatProps[];
  newChat?: SentChatProps;
  lastChat?: string;
  sender?: string;
  userId?: string;
};

type Dispatch = (action: ActionType) => void;

const StateContext = createContext<State | undefined>(undefined);
const DispatchContext = createContext<Dispatch | undefined>(undefined);

const initialState = {
  initialized: false,
  chats: [],
  lastChat: '',
  sender: '',
  sentChats: [],
};

const stateReducer = (state: State, action: ActionType): State => {
  switch (action.type) {
    case 'initialized':
      return {
        ...state,
        initialized: true,
        ...action,
      };
    case 'additional':
      return {
        ...state,
        initialized: true,
        chats: [...state.chats, ...action.chats],
        lastChat: action.lastChat,
      };
    case 'changeActive':
      return {
        ...state,
        sender: action.sender,
      };
    case 'newChat':
      localStorage.setItem(
        `${action.userId}-sentChats`,
        JSON.stringify([...state.sentChats, action.newChat])
      );
      return {
        ...state,
        sentChats: [...state.sentChats, action.newChat],
      };
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
