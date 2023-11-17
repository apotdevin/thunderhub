import React, { useState } from 'react';
import { ApiContext } from '../../../../api/GatewayApiProvider';
import {
  Card,
  CardWithTitle,
  Separation,
  SingleLine,
  SubTitle,
} from '../../../../components/generic/Styled';
import { Anchor } from 'react-feather';
import { renderLine } from '../../../../components/generic/helpers';
import { GatewayInfo } from '../../../../api/types';
import { toast } from 'react-toastify';
import { Input } from '../../../../components/input';
import { ColorButton } from '../../../../components/buttons/colorButton/ColorButton';

export const FedimintGatewayCard = () => {
  const { gateway } = React.useContext(ApiContext);
  const [gatewayInfo, setGatewayInfo] = useState<GatewayInfo>({
    federations: [],
    fees: {
      base_msat: 0,
      proportional_millionths: 0,
    },
    lightning_alias: '',
    lightning_pub_key: '',
    version_hash: '',
  });
  const [inviteCode, setInviteCode] = useState('');

  const handleEnter = () => {
    gateway
      .connectFederation(inviteCode)
      .then(() => {
        toast.success('Successfully connected to federation!');
        setInviteCode('');
        gateway
          .fetchInfo()
          .then(setGatewayInfo)
          .catch(({ message, error }) => {
            console.log(error);
            toast.error(message);
          });
      })
      .catch(({ message, error }) => {
        console.log(error);
        toast.error(message);
      });
  };

  return (
    <CardWithTitle>
      <Card>
        <SingleLine>
          <Anchor size={18} />
          <SubTitle>Fedimint Ecash</SubTitle>
        </SingleLine>
        <Separation />
        {gatewayInfo.federations.length === 0 ? (
          <>
            <div style={{ margin: '-4px 0 6px 0' }}>
              <SingleLine>
                {renderLine('Connect to a Federation', ' ')}
              </SingleLine>
            </div>
            <SingleLine>
              <Input
                placeholder="Fedimint Invite Code"
                value={inviteCode}
                onChange={e => setInviteCode(e.target.value)}
              />
              <ColorButton
                disabled={inviteCode === ''}
                onClick={handleEnter}
                withMargin={'0 0'}
                fullWidth={false}
              >
                Connect
              </ColorButton>
            </SingleLine>
          </>
        ) : (
          <>{renderLine('Alias', gatewayInfo.federations[0].federation_id)}</>
        )}
      </Card>
    </CardWithTitle>
  );
};
