import React, { createContext, useContext, useReducer, useEffect } from 'react';

const STORAGE_KEY = 'notificationSettings-v2';

type State = {
  invoices: boolean;
  payments: boolean;
  channels: boolean;
  forwards: boolean;
  forwardAttempts: boolean;
  autoClose: boolean;
};

type ActionType = {
  type: 'change' | 'initChange';
  invoices?: boolean;
  payments?: boolean;
  channels?: boolean;
  forwards?: boolean;
  forwardAttempts?: boolean;
  autoClose?: boolean;
};

type Dispatch = (action: ActionType) => void;

const StateContext = createContext<State | undefined>(undefined);
const DispatchContext = createContext<Dispatch | undefined>(undefined);

const initialState: State = {
  invoices: true,
  payments: true,
  channels: true,
  forwards: false,
  forwardAttempts: false,
  autoClose: true,
};

const stateReducer = (state: State, action: ActionType): State => {
  const { type, ...settings } = action;
  switch (type) {
    case 'initChange': {
      return {
        ...state,
        ...settings,
      };
    }
    case 'change': {
      const newState = {
        ...state,
        ...settings,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(newState));
      return newState;
    }
    default:
      return state;
  }
};

const NotificationProvider: React.FC = ({ children }) => {
  const [state, dispatch] = useReducer(stateReducer, initialState);

  useEffect(() => {
    const savedConfig = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}');
    dispatch({ type: 'initChange', ...savedConfig });
  }, []);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
};

const useNotificationState = () => {
  const context = useContext(StateContext);
  if (context === undefined) {
    throw new Error(
      'useNotificationState must be used within a NotificationProvider'
    );
  }
  return context;
};

const useNotificationDispatch = () => {
  const context = useContext(DispatchContext);
  if (context === undefined) {
    throw new Error(
      'useNotificationDispatch must be used within a NotificationProvider'
    );
  }
  return context;
};

export { NotificationProvider, useNotificationState, useNotificationDispatch };
