import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import CryptoJS from 'crypto-js';
import { useRouter } from 'next/router';
import { toast } from 'react-toastify';
import { useAccount } from '../../context/AccountContext';
import { saveUserAuth, getAccountId } from '../../utils/auth';
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

const QRLogin = dynamic(() => import('./views/QRLogin'), {
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
  const { changeAccount, accounts } = useAccount();
  const { push } = useRouter();

  const dispatchChat = useChatDispatch();
  const dispatch = useStatusDispatch();

  const [name, setName] = useState<string>();
  const [host, setHost] = useState<string>();
  const [admin, setAdmin] = useState<string>();
  const [viewOnly, setViewOnly] = useState<string>();
  const [cert, setCert] = useState<string>();
  const [password, setPassword] = useState<string>();

  const [adminChecked, setAdminChecked] = useState(false);

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
    dispatchChat({ type: 'disconnected' });
    changeAccount(id);

    push(appendBasePath('/'));
  };

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

    const accountExists =
      accounts.filter(account => account.id === id).length > 0;

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

  const handleSave = () => {
    if (!host) {
      toast.error('A host url is needed to connect.');
    } else if (!admin && !viewOnly) {
      toast.error('View-Only or Admin macaroon are needed to connect.');
    } else {
      let correctViewOnly = viewOnly;
      if (!viewOnly && admin && !password) {
        correctViewOnly = admin;
      }

      const encryptedAdmin =
        admin && password
          ? CryptoJS.AES.encrypt(admin, password).toString()
          : undefined;

      saveUserAuth({
        name,
        host,
        admin: encryptedAdmin,
        viewOnly: correctViewOnly,
        cert,
        accounts,
      });

      const id = getAccountId(host, correctViewOnly, encryptedAdmin, cert);

      dispatch({ type: 'disconnected' });
      dispatchChat({ type: 'disconnected' });
      changeAccount(id);

      push(appendBasePath('/'));
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
