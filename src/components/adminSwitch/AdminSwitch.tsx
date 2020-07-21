import React from 'react';
import { useAccountState, CLIENT_ACCOUNT } from 'src/context/AccountContext';

export const AdminSwitch: React.FC = ({ children }) => {
  const { account, session } = useAccountState();

  if (account?.type === CLIENT_ACCOUNT) {
    if (!account.admin && !session) {
      return null;
    }
  }

  return <>{children}</>;
};
