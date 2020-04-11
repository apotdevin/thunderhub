import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import { toast } from 'react-toastify';
import {
  Sub4Title,
  NoWrapTitle,
  SubTitle,
  ResponsiveLine,
} from '../../generic/Styled';
import { Circle, ChevronRight } from '../../generic/Icons';
import styled from 'styled-components';
import { useAccount } from '../../../context/AccountContext';
import { saveSessionAuth } from '../../../utils/auth';
import { useSettings } from '../../../context/SettingsContext';
import { textColorMap, mediaDimensions } from '../../../styles/Themes';
import { ColorButton } from '../colorButton/ColorButton';
import { Input } from '../../input/Input';
import { useSize } from '../../../hooks/UseSize';

const RadioText = styled.div`
  margin-left: 10px;
`;

const ButtonRow = styled.div`
  width: auto;
  display: flex;
  justify-content: center;
  align-items: center;
`;

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
  const { width } = useSize();
  const { theme } = useSettings();

  const [pass, setPass] = useState<string>('');
  const [storeSession, setStoreSession] = useState<boolean>(false);
  const { host, cert, refreshAccount } = useAccount();

  const handleClick = () => {
    try {
      const bytes = CryptoJS.AES.decrypt(macaroon, pass);
      const decrypted = bytes.toString(CryptoJS.enc.Utf8);

      if (storeSession) {
        saveSessionAuth(decrypted);
        refreshAccount();
      }
      const auth = { host, macaroon: decrypted, cert };
      callback({ variables: { ...variables, auth } });
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
    <ColorButton color={color} onClick={onClick}>
      <Circle size={'10px'} fillcolor={selected ? textColorMap[theme] : ''} />
      <RadioText>{text}</RadioText>
    </ColorButton>
  );

  return (
    <>
      <SubTitle>Unlock your Account</SubTitle>
      <ResponsiveLine>
        <Sub4Title>Password:</Sub4Title>
        <Input
          withMargin={width <= mediaDimensions.mobile ? '0' : '0 0 0 16px'}
          type={'password'}
          onChange={e => setPass(e.target.value)}
        />
      </ResponsiveLine>
      <ResponsiveLine>
        <NoWrapTitle>Don't ask me again this session:</NoWrapTitle>
        <ButtonRow>
          {renderButton(() => setStoreSession(true), 'Yes', storeSession)}
          {renderButton(() => setStoreSession(false), 'No', !storeSession)}
        </ButtonRow>
      </ResponsiveLine>
      <ColorButton
        disabled={pass === ''}
        onClick={handleClick}
        color={color}
        fullWidth={true}
        withMargin={'16px 0 0'}
      >
        Unlock
        <ChevronRight />
      </ColorButton>
    </>
  );
};
