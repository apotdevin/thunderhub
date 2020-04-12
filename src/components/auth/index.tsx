import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { LoginForm } from './views/NormalLogin';
import { ConnectLoginForm } from './views/ConnectLogin';
import { BTCLoginForm } from './views/BTCLogin';
import { ViewCheck } from './checks/ViewCheck';
import CryptoJS from 'crypto-js';
import { useAccount } from '../../context/AccountContext';
import { saveUserAuth, getAccountId } from '../../utils/auth';
import { useConnectionDispatch } from '../../context/ConnectionContext';
import { useStatusDispatch } from '../../context/StatusContext';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { LoadingCard } from '../loading/LoadingCard';

const PasswordInput = dynamic(() => import('./views/Password'), {
  ssr: false,
  loading: () => <LoadingCard noCard={true} />,
});

const QRLogin = dynamic(() => import('./views/QRLogin'), {
  ssr: false,
  loading: () => <LoadingCard noCard={true} />,
});

type AuthProps = {
  type: string;
  status: string;
  callback: () => void;
  setStatus: (state: string) => void;
};

export const Auth = ({ type, status, callback, setStatus }: AuthProps) => {
  const { changeAccount, accounts } = useAccount();
  const { push } = useRouter();

  const dispatch = useConnectionDispatch();
  const dispatchState = useStatusDispatch();

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
    skipCheck,
  }: {
    host?: string;
    admin?: string;
    viewOnly?: string;
    cert?: string;
    skipCheck?: boolean;
  }) => {
    const id = getAccountId(
      host ?? '',
      viewOnly ?? '',
      admin ?? '',
      cert ?? ''
    );

    const accountExists = accounts.findIndex(account => account.id === id) > -1;

    if (accountExists) {
      toast.error('Account already exists.');
    } else if (!host) {
      toast.error('A host url is needed to connect.');
    } else if (!admin && !viewOnly) {
      toast.error('View-Only or Admin macaroon are needed to connect.');
    } else if (skipCheck) {
      quickSave({ name, cert, admin, viewOnly, host });
    } else {
      host && setHost(host);
      admin && setAdmin(admin);
      viewOnly && setViewOnly(viewOnly);
      cert && setCert(cert);

      setStatus('confirmNode');
    }
  };

  const quickSave = ({
    name = 'Unknown',
    host,
    admin,
    viewOnly,
    cert,
  }: {
    name?: string;
    host?: string;
    admin?: string;
    viewOnly?: string;
    cert?: string;
  }) => {
    saveUserAuth({
      name,
      host: host || '',
      admin,
      viewOnly,
      cert,
      accounts,
    });

    const id = getAccountId(host, viewOnly, admin, cert);

    dispatch({ type: 'disconnected' });
    dispatchState({ type: 'disconnected' });
    changeAccount(id);

    push('/');
  };

  const handleSave = () => {
    if (!host) {
      toast.error('A host url is needed to connect.');
    } else if (!admin && !viewOnly) {
      toast.error('View-Only or Admin macaroon are needed to connect.');
    } else {
      const encryptedAdmin =
        admin && password
          ? CryptoJS.AES.encrypt(admin, password).toString()
          : undefined;

      saveUserAuth({
        name,
        host,
        admin: encryptedAdmin,
        viewOnly,
        cert,
        accounts,
      });

      const id = getAccountId(host, viewOnly, admin, cert);

      dispatch({ type: 'disconnected' });
      dispatchState({ type: 'disconnected' });
      changeAccount(id);

      push('/');
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
      case 'qrcode':
        return <QRLogin handleSet={handleSet} />;
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
          callback={handleSave}
          loading={false}
        />
      )}
    </>
  );
};
