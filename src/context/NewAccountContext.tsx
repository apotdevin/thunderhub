import * as React from 'react';
import {
  getAccountById,
  deleteAccountById,
  addIdAndTypeToAccount,
  getAuthFromAccount,
} from './helpers/context';

export type SERVER_ACCOUNT_TYPE = 'sso' | 'server';
export type ACCOUNT_TYPE = 'client';

export const CLIENT_ACCOUNT: ACCOUNT_TYPE = 'client';
export const SSO_ACCOUNT: SERVER_ACCOUNT_TYPE = 'sso';
export const SERVER_ACCOUNT: SERVER_ACCOUNT_TYPE = 'server';

export type AccountProps = {
  name: string;
  host: string;
  admin: string;
  viewOnly: string;
  cert: string;
};

export type AuthType =
  | {
      host: string;
      macaroon: string;
      cert: string | null;
    }
  | {
      type: SERVER_ACCOUNT_TYPE;
    };

export type CompleteAccount =
  | ({
      type: 'client';
      id: string;
    } & AccountProps)
  | {
      type: 'sso' | 'server';
      id: string;
      name: string;
    };

type State = {
  auth: AuthType | null;
  activeAccount: string | null;
  session: string | null;
  account: CompleteAccount | null;
  accounts: CompleteAccount[];
};

type ActionType =
  | {
      type: 'changeAccount' | 'deleteAccount';
      changeId: string;
    }
  | {
      type: 'addAccounts';
      accountsToAdd: CompleteAccount[];
    }
  | {
      type: 'addAccountAndSave';
      accountToAdd: AccountProps;
    }
  | {
      type: 'addSession';
      session: string;
    }
  | {
      type: 'removeSession';
    }
  | {
      type: 'deleteAll';
    };

type Dispatch = (action: ActionType) => void;

const StateContext = React.createContext<State | undefined>(undefined);
const DispatchContext = React.createContext<Dispatch | undefined>(undefined);

const initialState: State = {
  auth: null,
  session: null,
  activeAccount: null,
  account: null,
  accounts: [],
};

const stateReducer = (state: State, action: ActionType): State => {
  switch (action.type) {
    case 'changeAccount': {
      const { account, id } = getAccountById(action.changeId, state.accounts);
      const auth = getAuthFromAccount(account);

      localStorage.setItem('active', `${id}`);
      sessionStorage.removeItem('session');

      return {
        ...state,
        auth,
        session: null,
        account,
        activeAccount: id,
      };
    }
    case 'deleteAccount': {
      if (!state.accounts || state?.accounts?.length <= 0) {
        return state;
      }
      const { accounts, id } = deleteAccountById(
        state.account.id,
        action.changeId,
        state.accounts
      );
      localStorage.setItem('accounts', JSON.stringify(accounts));
      !id && sessionStorage.removeItem('session');
      return {
        ...state,
        accounts,
        ...(!id && { activeId: null, session: null, account: null }),
      };
    }
    case 'addAccounts': {
      if (action.accountsToAdd.length > 0) {
        return {
          ...state,
          accounts: [...state.accounts, ...action.accountsToAdd],
        };
      }
      return state;
    }
    case 'addAccountAndSave': {
      const account = addIdAndTypeToAccount(action.accountToAdd);
      const activeAccount = account.id;
      const accounts = [...state.accounts, account];

      localStorage.setItem('active', `${activeAccount}`);

      const savedAccounts = JSON.parse(
        localStorage.getItem('accounts') || '[]'
      );
      localStorage.setItem(
        'accounts',
        JSON.stringify([...savedAccounts, action.accountToAdd])
      );
      return {
        ...state,
        account,
        activeAccount,
        accounts,
      };
    }
    case 'addSession':
      sessionStorage.setItem('session', action.session);
      return {
        ...state,
        auth: getAuthFromAccount(state.account, action.session),
        session: action.session,
      };
    case 'removeSession':
      sessionStorage.removeItem('session');
      return {
        ...state,
        auth: getAuthFromAccount(state.account),
        session: null,
      };
    case 'deleteAll':
      sessionStorage.removeItem('session');
      localStorage.removeItem('accounts');
      localStorage.removeItem('active');
      return initialState;
    default:
      return state;
  }
};

const AccountProvider: React.FC = ({ children }) => {
  const [state, dispatch] = React.useReducer(stateReducer, initialState);

  return (
    <DispatchContext.Provider value={dispatch}>
      <StateContext.Provider value={state}>{children}</StateContext.Provider>
    </DispatchContext.Provider>
  );
};

const useAccountState = () => {
  const context = React.useContext(StateContext);
  if (context === undefined) {
    throw new Error('useAccountState must be used within a AccountProvider');
  }
  return context;
};

const useAccountDispatch = () => {
  const context = React.useContext(DispatchContext);
  if (context === undefined) {
    throw new Error('useAccountDispatch must be used within a AccountProvider');
  }
  return context;
};

export { AccountProvider, useAccountState, useAccountDispatch };
