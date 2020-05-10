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
  maxFee: number;
  chatPollingSpeed: number;
};

type ActionType = {
  type:
    | 'initialized'
    | 'additional'
    | 'changeActive'
    | 'newChat'
    | 'hideNonVerified'
    | 'hideFee'
    | 'changeFee'
    | 'pollingSpeed'
    | 'disconnected';
  chats?: ChatProps[];
  sentChats?: SentChatProps[];
  newChat?: SentChatProps;
  lastChat?: string;
  sender?: string;
  userId?: string;
  hideFee?: boolean;
  hideNonVerified?: boolean;
  maxFee?: number;
  chatPollingSpeed?: number;
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
  maxFee: 20,
  chatPollingSpeed: 1000,
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
      localStorage.setItem('hideFee', JSON.stringify(action.hideFee));
      return {
        ...state,
        hideFee: action.hideFee,
      };
    case 'hideNonVerified':
      localStorage.setItem(
        'hideNonVerified',
        JSON.stringify(action.hideNonVerified)
      );
      return {
        ...state,
        hideNonVerified: action.hideNonVerified,
      };
    case 'changeFee':
      localStorage.setItem('maxChatFee', JSON.stringify(action.maxFee));
      return {
        ...state,
        maxFee: action.maxFee,
      };
    case 'pollingSpeed':
      localStorage.setItem(
        'chatPollingSpeed',
        JSON.stringify(action.chatPollingSpeed)
      );
      return {
        ...state,
        chatPollingSpeed: action.chatPollingSpeed,
      };
    default:
      return state;
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
