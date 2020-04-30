import React, { createContext, useContext, useReducer } from 'react';

type ChatProps = {
  date?: string;
  contentType?: string;
  alias?: string;
  message?: string;
  id?: string;
  sender?: string;
  tokens?: number;
};

type SentChatProps = {
  date?: string;
  contentType?: string;
  alias?: string;
  message?: string;
  id?: string;
  sender?: string;
  isSent?: boolean;
  feePaid?: number;
  tokens?: number;
};

type State = {
  initialized: boolean;
  chats: ChatProps[];
  sentChats: SentChatProps[];
  lastChat: string;
  sender: string;
  hideFee: boolean;
  hideNonVerified: boolean;
};

type ActionType = {
  type:
    | 'initialized'
    | 'additional'
    | 'changeActive'
    | 'newChat'
    | 'hideNonVerified'
    | 'hideFee'
    | 'disconnected';
  chats?: ChatProps[];
  sentChats?: SentChatProps[];
  newChat?: SentChatProps;
  lastChat?: string;
  sender?: string;
  userId?: string;
  hideFee?: boolean;
  hideNonVerified?: boolean;
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
  hideFee: false,
  hideNonVerified: false,
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
        ...(action.sender && { sender: action.sender }),
      };
    case 'hideFee':
      const hideFee = !state.hideFee;
      localStorage.setItem('hideFee', JSON.stringify(hideFee));
      return {
        ...state,
        hideFee,
      };
    case 'hideNonVerified':
      const hideNonVerified = !state.hideNonVerified;
      localStorage.setItem('hideNonVerified', JSON.stringify(hideNonVerified));
      return {
        ...state,
        hideNonVerified,
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
