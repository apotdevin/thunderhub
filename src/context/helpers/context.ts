import { getUUID } from '../../utils/auth';
import {
  CompleteAccount,
  AccountProps,
  CLIENT_ACCOUNT,
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
    sessionStorage.removeItem('session');
    activeId = newAccounts[0].id;
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
