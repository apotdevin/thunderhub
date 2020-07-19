import { getUUID } from '../../utils/auth';
import {
  CompleteAccount,
  AccountProps,
  CLIENT_ACCOUNT,
  AuthType,
  defaultAuth,
} from '../AccountContext';

export const getAccountById = (id: string, accounts: CompleteAccount[]) => {
  const correctAccount: CompleteAccount | null | undefined = accounts.find(
    a => a.id === id
  );

  return {
    account: correctAccount || null,
    id: correctAccount ? correctAccount.id : null,
  };
};

export const deleteAccountById = (
  currentId: string,
  id: string,
  accounts: CompleteAccount[]
) => {
  const newAccounts: CompleteAccount[] = accounts.filter(a => a.id !== id);

  if (newAccounts.length <= 0) {
    return { accounts: [], id: null };
  }

  let activeId: string | null = currentId;
  if (currentId === id) {
    activeId = null;
  }

  return { accounts: newAccounts, id: activeId };
};

export const addIdAndTypeToAccount = (
  account: AccountProps
): CompleteAccount => {
  const { host, viewOnly, admin, cert } = account;
  return {
    ...account,
    type: CLIENT_ACCOUNT,
    id: getUUID(`${host}-${viewOnly}-${admin !== '' ? 1 : 0}-${cert}`),
  };
};

export const getAuthFromAccount = (
  account: CompleteAccount | undefined | null,
  session?: string | null
): AuthType => {
  if (!account) return defaultAuth;
  if (account.type !== CLIENT_ACCOUNT) {
    return {
      type: account.type,
      id: account.id,
    };
  }
  const { host, viewOnly, cert } = account;
  if (!host) {
    return defaultAuth;
  }
  if (!viewOnly && !session) {
    return defaultAuth;
  }
  return {
    type: account.type,
    host,
    macaroon: session || viewOnly,
    cert,
  };
};
