import React, { useState } from 'react';
import { X } from 'react-feather';
import { toast } from 'react-toastify';
import { InputWithDeco } from '../../components/input/InputWithDeco';
import {
  CardWithTitle,
  SubTitle,
  Card,
  SingleLine,
  DarkSubTitle,
  Separation,
} from '../../components/generic/Styled';
import { ColorButton } from '../../components/buttons/colorButton/ColorButton';
import { gatewayApi } from '../../api/GatewayApi';
import { useGatewayDispatch } from '../../context/GatewayContext';

export const AddMint = () => {
  const gatewayDispatch = useGatewayDispatch();
  const [isAdding, setIsAdding] = useState<boolean>(false);
  const [inviteCode, setInviteCode] = useState<string>('');

  const handleEnter = () => {
    gatewayApi.connectFederation(inviteCode).then(() => {
      gatewayApi
        .fetchInfo()
        .then(info => gatewayDispatch({ type: 'connected', state: info }))
        .catch(({ error }) => {
          toast.error(error.message);
        });
    });
  };

  return (
    <CardWithTitle>
      <SubTitle>Mint Management</SubTitle>
      <Card>
        <SingleLine>
          <DarkSubTitle>Connect to a new Federation</DarkSubTitle>
          <ColorButton
            withMargin={'4px 0'}
            onClick={() => setIsAdding(prev => !prev)}
          >
            {isAdding ? <X size={18} /> : 'Add'}
          </ColorButton>
        </SingleLine>
        {isAdding && (
          <>
            <Separation />
            <SingleLine>
              <InputWithDeco
                title={'Invite Code'}
                value={inviteCode}
                inputCallback={value => setInviteCode(value)}
                placeholder={'Paste Invite Code'}
              />
              <div style={{ width: '16px' }} />
              <ColorButton
                disabled={inviteCode === ''}
                onClick={handleEnter}
                fullWidth={true}
              >
                Connect
              </ColorButton>
            </SingleLine>
          </>
        )}
      </Card>
    </CardWithTitle>
  );
};
