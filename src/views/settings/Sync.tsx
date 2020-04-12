import React, { useState } from 'react';
import {
  CardWithTitle,
  SubTitle,
  Card,
  Sub4Title,
  Separation,
} from '../../components/generic/Styled';
import { SettingsLine } from '../../../pages/settings';
import {
  MultiButton,
  SingleButton,
} from '../../components/buttons/multiButton/MultiButton';
import { ColorButton } from '../../components/buttons/colorButton/ColorButton';
import { XSvg } from '../../components/generic/Icons';
import { useAccount } from '../../context/AccountContext';
import QRCode from 'qrcode.react';
import styled from 'styled-components';
import { useInterval } from '../../hooks/UseInterval';
import Modal from '../../components/modal/ReactModal';
import { themeColors } from '../../styles/Themes';

const QRWrapper = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  width: 100%;
`;

export const SyncSettings = () => {
  const { name, host, admin, viewOnly, cert } = useAccount();

  const getValue = () => {
    switch (true) {
      case !!viewOnly:
        return 'viewOnly';
      default:
        return 'adminOnly';
    }
  };

  const [state, setState] = useState('none');
  const [type, setType] = useState(getValue());

  const getObject = () => {
    switch (type) {
      case 'complete':
        return { viewOnly, admin };
      case 'adminOnly':
        return { admin };
      default:
        return { viewOnly };
    }
  };

  const renderSettings = () => (
    <>
      <Separation />
      <SettingsLine>
        <Sub4Title>Sync Type</Sub4Title>
        <MultiButton>
          {viewOnly && (
            <SingleButton
              selected={type === 'viewOnly'}
              onClick={() => setType('viewOnly')}
            >
              View-Only
            </SingleButton>
          )}
          {admin && (
            <SingleButton
              selected={type === 'adminOnly'}
              onClick={() => setType('adminOnly')}
            >
              Admin-Only
            </SingleButton>
          )}
          {viewOnly && admin && (
            <SingleButton
              selected={type === 'complete'}
              onClick={() => setType('complete')}
            >
              Admin and View
            </SingleButton>
          )}
        </MultiButton>
      </SettingsLine>
      <SettingsLine>
        <ColorButton
          withMargin={'16px 0 0'}
          fullWidth={true}
          onClick={() => setState('finish')}
        >
          Generate QR
        </ColorButton>
      </SettingsLine>
    </>
  );

  const renderQRCode = () => {
    const connection = JSON.stringify({
      name,
      host,
      cert,
      ...getObject(),
    });

    return (
      <Modal
        isOpen={true}
        noMinWidth={true}
        closeCallback={() => setState('none')}
      >
        <QRWrapper>
          <SubTitle subtitleColor={themeColors.black}>
            Scan with ThunderHub
          </SubTitle>
          <QRLoop connection={connection} />
        </QRWrapper>
      </Modal>
    );
  };

  return (
    <CardWithTitle>
      <SubTitle>Sync</SubTitle>
      <Card>
        <SettingsLine>
          <Sub4Title>Sync account to another device</Sub4Title>
          <ColorButton
            onClick={() =>
              setState((prev: string) =>
                prev !== 'none' ? 'none' : 'generate'
              )
            }
          >
            {state !== 'none' ? <XSvg /> : 'Sync'}
          </ColorButton>
        </SettingsLine>
        {state === 'generate' && renderSettings()}
        {state === 'finish' && renderQRCode()}
      </Card>
    </CardWithTitle>
  );
};

const QRLoop = ({ connection }: { connection: string }) => {
  const textArray = connection.match(/.{1,100}/g) ?? [];
  const length = textArray.length;

  const objectArray = textArray.map((value: string, index: number) =>
    JSON.stringify({
      index,
      total: length,
      auth: value,
    })
  );

  const [count, setCount] = useState(0);

  useInterval(() => {
    setCount((prev: number) => {
      if (prev < length - 1) {
        return prev + 1;
      }
      return 0;
    });
  }, 1000);

  return <QRCode value={objectArray[count]} renderAs={'svg'} size={200} />;
};
