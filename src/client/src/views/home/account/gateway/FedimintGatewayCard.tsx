<<<<<<< HEAD
import React, { useState } from 'react';
import {
  Card,
  CardWithTitle,
  LeftAlign,
  Separation,
  SingleLine,
  SubTitle,
} from '../../../../components/generic/Styled';
import { Sun } from 'react-feather';
import { renderLine } from '../../../../components/generic/helpers';
import { toast } from 'react-toastify';
import { Input } from '../../../../components/input';
import { ColorButton } from '../../../../components/buttons/colorButton/ColorButton';
import { Price } from '../../../../components/price/Price';
import { useGatewayDispatch } from '../../../../context/GatewayContext';
import { gatewayApi } from '../../../../api/GatewayApi';
import { GatewayInfo } from '../../../../api/types';

interface FedimintGatewayCardProps {
  gatewayInfo: GatewayInfo;
}

const sectionColor = '#FFD300';

export const FedimintGatewayCard = ({
  gatewayInfo,
}: FedimintGatewayCardProps) => {
  const gatewayDispath = useGatewayDispatch();
  const [inviteCode, setInviteCode] = useState('');

  const handleEnter = () => {
    gatewayApi.connectFederation(inviteCode).then(() => {
      gatewayApi
        .fetchInfo()
        .then(info => gatewayDispath({ type: 'connected', state: info }))
        .catch(({ error }) => {
          toast.error(error.message);
        });
    });
  };

  return (
    <CardWithTitle>
      <Card>
        <LeftAlign>
          <Sun size={18} color={sectionColor} />
          <SubTitle>Fedimint Ecash</SubTitle>
        </LeftAlign>
        <Separation />
        {!gatewayInfo.federations || gatewayInfo.federations.length === 0 ? (
          <>
            {/* TODO: Left Align the Text */}
            <div style={{ margin: '-4px 0 16px 0', textAlign: 'left' }}>
              {'Connect to a Federation'}
            </div>
            <SingleLine>
              <Input
                placeholder="Paste Invite Code"
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
          <div style={{ margin: '0px 0px 8px 0px', minHeight: '54px' }}>
            {renderLine(
              'Total Amount',
              <Price amount={gatewayInfo.federations[0].balance_msat} />
            )}
            {renderLine(
              'Connected Federations',
              gatewayInfo.federations.length
            )}
          </div>
        )}
      </Card>
    </CardWithTitle>
  );
};
||||||| parent of 9e521814 (feat: connect to federation card)
=======
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
>>>>>>> 9e521814 (feat: connect to federation card)
