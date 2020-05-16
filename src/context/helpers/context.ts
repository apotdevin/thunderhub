import { getUUID } from '../../utils/auth';
import {
  CompleteAccount,
  AccountProps,
  CLIENT_ACCOUNT,
  AuthType,
} from '../NewAccountContext';

export const getAccountById = (id: string, accounts: CompleteAccount[]) => {
  const correctAccount: CompleteAccount | null = accounts.find(
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
  account: CompleteAccount,
  session?: string
): AuthType => {
  if (account.type !== CLIENT_ACCOUNT) {
    return {
      type: account.type,
    };
  }
  const { host, viewOnly, cert } = account;
  if (!host) {
    return null;
  }
  if (!viewOnly && !session) {
    return null;
  }
  return {
    host,
    macaroon: viewOnly && viewOnly !== '' ? viewOnly : session,
    cert,
  };
};
