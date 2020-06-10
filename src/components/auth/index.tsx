import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import AES from 'crypto-js/aes';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import {
  useAccountState,
  useAccountDispatch,
} from 'src/context/AccountContext';
import { getAccountId } from '../../utils/auth';
import { useStatusDispatch } from '../../context/StatusContext';
import { LoadingCard } from '../loading/LoadingCard';
import { appendBasePath } from '../../utils/basePath';
import { useChatDispatch } from '../../context/ChatContext';
import { ViewCheck } from './checks/ViewCheck';
import { BTCLoginForm } from './views/BTCLogin';
import { ConnectLoginForm } from './views/ConnectLogin';
import { LoginForm } from './views/NormalLogin';

const PasswordInput = dynamic(() => import('./views/Password'), {
  ssr: false,
  loading: function Loading() {
    return <LoadingCard noCard={true} />;
  },
});

type AuthProps = {
  type: string;
  status: string;
  callback: () => void;
  setStatus: (state: string) => void;
};

export const Auth = ({ type, status, callback, setStatus }: AuthProps) => {
  const { accounts } = useAccountState();
  const { push } = useRouter();

  const dispatch = useStatusDispatch();
  const dispatchChat = useChatDispatch();
  const dispatchAccount = useAccountDispatch();

  const [name, setName] = useState<string>();
  const [host, setHost] = useState<string>();
  const [admin, setAdmin] = useState<string>();
  const [viewOnly, setViewOnly] = useState<string>();
  const [cert, setCert] = useState<string>();
  const [password, setPassword] = useState<string>();

  const [adminChecked, setAdminChecked] = useState(false);

  const handleSet = ({
    host,
    admin,
    viewOnly,
    cert,
  }: {
    host?: string;
    admin?: string;
    viewOnly?: string;
    cert?: string;
  }) => {
    const id = getAccountId(
      host ?? '',
      viewOnly ?? '',
      admin ?? '',
      cert ?? ''
    );

    const accountExists = accounts
      ? accounts.filter(account => account.id === id).length > 0
      : false;

    if (accountExists) {
      toast.error('Account already exists.');
    } else if (!host) {
      toast.error('A host url is needed to connect.');
    } else if (!admin && !viewOnly) {
      toast.error('View-Only or Admin macaroon are needed to connect.');
    } else {
      host && setHost(host);
      admin && setAdmin(admin);
      viewOnly && setViewOnly(viewOnly);
      cert && setCert(cert);

      setStatus('confirmNode');
    }
  };

  const handleSave = () => {
    if (!host) {
      toast.error('A host url is needed to connect.');
    } else if (!admin && !viewOnly) {
      toast.error('View-Only or Admin macaroon are needed to connect.');
    } else {
      let correctViewOnly = viewOnly || null;
      if (!viewOnly && admin && !password) {
        correctViewOnly = admin;
      }

      const encryptedAdmin =
        admin && password ? AES.encrypt(admin, password).toString() : null;

      dispatch({ type: 'disconnected' });
      dispatchChat({ type: 'disconnected' });
      dispatchAccount({
        type: 'addAccountAndSave',
        accountToAdd: {
          name,
          host,
          admin: encryptedAdmin,
          viewOnly: correctViewOnly,
          cert,
        },
        ...(!correctViewOnly && { session: admin }),
      });

      push(appendBasePath('/home'));
    }
  };

  const handleConnect = () => {
    if (adminChecked) {
      setStatus('password');
    } else {
      handleSave();
    }
  };

  const renderView = () => {
    switch (type) {
      case 'login':
        return <LoginForm handleSet={handleSet} />;
      case 'connect':
        return <ConnectLoginForm handleSet={handleSet} />;
      default:
        return <BTCLoginForm handleSet={handleSet} />;
    }
  };

  return (
    <>
      {status === 'none' && renderView()}
      {status === 'confirmNode' && host && (
        <ViewCheck
          host={host}
          admin={admin}
          viewOnly={viewOnly}
          cert={cert}
          adminChecked={adminChecked}
          setAdminChecked={setAdminChecked}
          handleConnect={handleConnect}
          callback={callback}
          setName={setName}
        />
      )}
      {status === 'password' && (
        <PasswordInput
          isPass={password}
          setPass={setPassword}
          callback={() => {
            handleSave();
            setStatus('none');
          }}
          loading={false}
        />
      )}
    </>
  );
};
