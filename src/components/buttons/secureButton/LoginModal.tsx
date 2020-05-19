import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import { toast } from 'react-toastify';
import { ChevronRight } from 'react-feather';
import {
  useAccountState,
  useAccountDispatch,
} from 'src/context/AccountContext';
import { getAuthFromAccount } from 'src/context/helpers/context';
import {
  Sub4Title,
  NoWrapTitle,
  SubTitle,
  ResponsiveLine,
} from '../../generic/Styled';
import { ColorButton } from '../colorButton/ColorButton';
import { Input } from '../../input/Input';
import { MultiButton, SingleButton } from '../multiButton/MultiButton';

interface LoginProps {
  macaroon: string;
  color?: string;
  callback: any;
  variables: {};
  setModalOpen: (value: boolean) => void;
}

export const LoginModal = ({
  macaroon,
  color,
  setModalOpen,
  callback,
  variables,
}: LoginProps) => {
  const [pass, setPass] = useState<string>('');
  const [storeSession, setStoreSession] = useState<boolean>(false);

  const { account } = useAccountState();
  const dispatch = useAccountDispatch();

  const handleClick = () => {
    try {
      const bytes = CryptoJS.AES.decrypt(macaroon, pass);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);

      if (storeSession) {
        dispatch({ type: 'addSession', session: decrypted });
      }

      callback({
        variables: {
          ...variables,
          auth: getAuthFromAccount(account, decrypted),
        },
      });

      setModalOpen(false);
    } catch (error) {
      toast.error('Wrong Password');
    }
  };

  const renderButton = (
    onClick: () => void,
    text: string,
    selected: boolean
  ) => (
    <SingleButton selected={selected} color={color} onClick={onClick}>
      {text}
    </SingleButton>
  );

  return (
    <>
      <SubTitle>Unlock your Account</SubTitle>
      <ResponsiveLine>
        <Sub4Title>Password:</Sub4Title>
        <Input
          withMargin={'0 0 0 16px'}
          mobileMargin={'0'}
          type={'password'}
          onChange={e => setPass(e.target.value)}
        />
      </ResponsiveLine>
      <ResponsiveLine>
        <NoWrapTitle>{`Don't ask me again this session:`}</NoWrapTitle>
        <MultiButton>
          {renderButton(() => setStoreSession(true), 'Yes', storeSession)}
          {renderButton(() => setStoreSession(false), 'No', !storeSession)}
        </MultiButton>
      </ResponsiveLine>
      <ColorButton
        disabled={pass === ''}
        onClick={handleClick}
        color={color}
        fullWidth={true}
        withMargin={'16px 0 0'}
      >
        Unlock
        <ChevronRight size={18} />
      </ColorButton>
    </>
  );
};
