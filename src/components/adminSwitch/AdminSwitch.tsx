import { useAccountState, CLIENT_ACCOUNT } from 'src/context/AccountContext';

export const AdminSwitch = ({ children }) => {
  const { account, session } = useAccountState();

  if (account?.type === CLIENT_ACCOUNT) {
    if (!account.admin && !session) {
      return null;
    }
  }

  return children;
};
