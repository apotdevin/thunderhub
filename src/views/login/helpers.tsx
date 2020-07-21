import {
  SSO_ACCOUNT,
  CLIENT_ACCOUNT,
  CompleteAccount,
} from 'src/context/AccountContext';

export const dontShowSessionLogin = (account: CompleteAccount): boolean => {
  switch (true) {
    case account.type === SSO_ACCOUNT:
    case account.type !== CLIENT_ACCOUNT && account.loggedIn:
    case account.type === CLIENT_ACCOUNT && !account.admin:
    case account.type === CLIENT_ACCOUNT &&
      !!account.admin &&
      !!account.viewOnly:
      return true;
    default:
      return false;
  }
};
