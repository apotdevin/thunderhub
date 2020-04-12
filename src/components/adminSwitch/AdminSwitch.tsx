import { useAccount } from '../../context/AccountContext';

interface AdminSwitchProps {
  children: any;
}

export const AdminSwitch = ({ children }: AdminSwitchProps) => {
  const { admin, sessionAdmin } = useAccount();

  if (!admin && !sessionAdmin) {
    return null;
  }

  return children;
};
