import React, { createContext, useContext, useReducer } from 'react';
import { Message } from '../../src/graphql/types';

export interface SentChatProps extends Message {
  isSent?: boolean;
  feePaid?: number;
}

type State = {
  initialized: boolean;
  chats: Message[];
  sentChats: SentChatProps[];
  lastChat: string;
  sender: string;
};

type ActionType =
  | {
      type: 'initialized';
      chats?: Message[];
      lastChat?: string;
      sender?: string;
      sentChats?: SentChatProps[];
    }
  | {
      type: 'additional';
      chats: Message[];
      lastChat: string;
    }
  | {
      type: 'changeActive';
      sender: string;
      userId: string;
    }
  | {
      type: 'newChat';
      sender: string;
      userId: string;
      newChat: SentChatProps;
    }
  | {
      type: 'disconnected';
    };

type Dispatch = (action: ActionType) => void;

const StateContext = createContext<State | undefined>(undefined);
const DispatchContext = createContext<Dispatch | undefined>(undefined);

const initialState: State = {
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
        ...(action.sender && { sender: action.sender }),
      };
    case 'disconnected':
      return initialState;
    default:
      return state;
  }
};

const ChatProvider: React.FC = ({ children }) => {
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
    throw new Error('useChatState must be used within a ChatProvider');
  }
  return context;
};

const useChatDispatch = () => {
  const context = useContext(DispatchContext);
  if (context === undefined) {
    throw new Error('useChatDispatch must be used within a ChatProvider');
  }
  return context;
};

export { ChatProvider, useChatState, useChatDispatch };
