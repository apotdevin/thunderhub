import * as React from 'react';
import Cookies from 'js-cookie';
import {
  getAccountById,
  deleteAccountById,
  addIdAndTypeToAccount,
  getAuthFromAccount,
} from './helpers/context';

export type SERVER_ACCOUNT_TYPE = 'sso' | 'server' | 'test';
export type ACCOUNT_TYPE = 'client';

export const CLIENT_ACCOUNT: ACCOUNT_TYPE = 'client';
export const SSO_ACCOUNT: SERVER_ACCOUNT_TYPE = 'sso';
export const SERVER_ACCOUNT: SERVER_ACCOUNT_TYPE = 'server';

type HasAccountType = 'fetched' | 'false' | 'error';

export type AccountProps = {
  name: string;
  host: string;
  admin: string;
  viewOnly: string;
  cert: string;
};

export type AuthType =
  | {
      type: ACCOUNT_TYPE;
      host: string;
      macaroon: string;
      cert: string | null;
    }
  | {
      type: SERVER_ACCOUNT_TYPE;
      id: string;
    };

export type AccountType = {
  type: ACCOUNT_TYPE;
  id: string;
} & AccountProps;

export type CompleteAccount =
  | AccountType
  | {
      type: SERVER_ACCOUNT_TYPE;
      id: string;
      name: string;
      loggedIn?: boolean;
    };

export const defaultAuth = { type: SERVER_ACCOUNT, id: '' };

type State = {
  initialized: boolean;
  finishedFetch: boolean;
  auth: AuthType;
  activeAccount: string | null;
  session: string | null;
  account: CompleteAccount | null;
  accounts: CompleteAccount[];
  hasAccount: HasAccountType;
};

type ActionType =
  | {
      type: 'initialize';
      changeId: string;
      accountsToAdd: CompleteAccount[];
      session: string;
    }
  | {
      type: 'changeAccount' | 'deleteAccount';
      changeId: string;
    }
  | {
      type: 'logout';
    }
  | {
      type: 'addServerAccounts';
      accountsToAdd: CompleteAccount[];
    }
  | {
      type: 'addAccountAndSave';
      accountToAdd: AccountProps;
      session?: string;
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
    }
  | {
      type: 'resetFetch';
    };

type Dispatch = (action: ActionType) => void;

const StateContext = React.createContext<State | undefined>(undefined);
const DispatchContext = React.createContext<Dispatch | undefined>(undefined);

const initialState: State = {
  initialized: false,
  finishedFetch: false,
  auth: defaultAuth,
  session: null,
  activeAccount: null,
  account: null,
  accounts: [],
  hasAccount: 'false',
};

const stateReducer = (state: State, action: ActionType): State => {
  switch (action.type) {
    case 'initialize': {
      if (state.initialized) {
        return state;
      }
      const { accountsToAdd, changeId, session } = action;

      const { account, id } = getAccountById(changeId, accountsToAdd);

      if (!account)
        return {
          ...state,
          initialized: true,
          accounts: accountsToAdd,
          activeAccount: changeId,
          session,
        };

      const auth = getAuthFromAccount(account, session);
      return {
        ...state,
        initialized: true,
        auth,
        account,
        accounts: accountsToAdd,
        activeAccount: id,
        session,
        hasAccount: 'fetched',
      };
    }
    case 'changeAccount': {
      const { account, id } = getAccountById(action.changeId, state.accounts);

      if (!account) return state;

      const auth = getAuthFromAccount(account);

      localStorage.setItem('active', `${id}`);
      sessionStorage.removeItem('session');

      return {
        ...state,
        auth,
        session: null,
        account,
        activeAccount: id,
        hasAccount: 'fetched',
      };
    }
    case 'logout':
      localStorage.removeItem('active');
      sessionStorage.clear();
      return {
        ...state,
        account: null,
        activeAccount: null,
        auth: defaultAuth,
        session: null,
      };
    case 'deleteAccount': {
      if (!state.accounts || state?.accounts?.length <= 0 || !state.account) {
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
    case 'addServerAccounts': {
      const clientAccounts = state.accounts.filter(
        a => a.type === CLIENT_ACCOUNT
      );
      const completeAccounts = [...clientAccounts, ...action.accountsToAdd];

      if (!state.activeAccount) {
        return {
          ...state,
          finishedFetch: true,
          accounts: completeAccounts,
        };
      }

      const { account } = getAccountById(state.activeAccount, completeAccounts);

      if (!account && completeAccounts.length > 0) {
        return {
          ...state,
          finishedFetch: true,
          accounts: completeAccounts,
          hasAccount: 'error',
        };
      }

      const auth = getAuthFromAccount(account, state.session);
      return {
        ...state,
        finishedFetch: true,
        hasAccount: 'fetched',
        auth,
        account,
        accounts: completeAccounts,
      };
    }
    case 'addAccountAndSave': {
      const account = addIdAndTypeToAccount(action.accountToAdd);
      const activeAccount = account.id;
      const accounts = [...state.accounts, account];

      const auth = getAuthFromAccount(account, action.session);

      if (action.session) {
        sessionStorage.setItem('session', action.session);
      }

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
        auth,
        account,
        accounts,
        activeAccount,
        hasAccount: 'fetched',
        ...(action.session && { session: action.session }),
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
      localStorage.clear();
      sessionStorage.clear();
      Cookies.remove('config');
      return initialState;
    case 'resetFetch':
      return {
        ...state,
        hasAccount: 'false',
      };
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
