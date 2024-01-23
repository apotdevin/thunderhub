import * as React from 'react';
import { useGetBaseNodesQuery } from '../../../../graphql/queries/__generated__/getBaseNodes.generated';
import {
  Separation,
  SingleLine,
  DarkSubTitle,
} from '../../../../components/generic/Styled';
import styled from 'styled-components';
import {
  themeColors,
  backgroundColor,
  mediaWidths,
} from '../../../../styles/Themes';
import { LoadingCard } from '../../../../components/loading/LoadingCard';
import {
  Cpu,
  ShoppingCart,
  Zap,
  Hexagon,
  Edit,
  Command,
  Gift,
  Smartphone,
  Pocket,
  TrendingUp,
  Box,
  X,
} from 'react-feather';
import { ColorButton } from '../../../../components/buttons/colorButton/ColorButton';
import { BaseNode } from '../../../../graphql/types';
import { OpenChannelCard } from './OpenChannel';
import { OpenRecommended } from './OpenRecommended';
import { Network } from '../../../../api/types';
import { useGatewayState } from '../../../../context/GatewayContext';

const signetNodes = [
  {
    name: '025698cc9ac623f5d1ba',
    public_key:
      '025698cc9ac623f5d1baf56310f2f1b62dfffee43ffcdb2c20ccb541f70497d540',
    socket: '54.158.203.78',
    connectionString:
      '025698cc9ac623f5d1baf56310f2f1b62dfffee43ffcdb2c20ccb541f70497d540@54.158.203.78:9739',
  },
  {
    name: 'mutiny-net-lnd',
    public_key:
      '02465ed5be53d04fde66c9418ff14a5f2267723810176c9212b722e542dc1afb1b',
    socket: '45.79.52.207',
    connectionString:
      '02465ed5be53d04fde66c9418ff14a5f2267723810176c9212b722e542dc1afb1b@45.79.52.207:9735',
  },
  {
    name: 'GREENFELONY',
    public_key:
      '0366abc8eb4da61e31a8d2c4520d31cabdf58cc5250f855657397f3dd62493938a',
    socket: '45.33.17.66',
    connectionString:
      '0366abc8eb4da61e31a8d2c4520d31cabdf58cc5250f855657397f3dd62493938a@45.33.17.66:39735',
  },
];

export const IconStyle = styled.div`
  margin-bottom: 8px;
  color: ${themeColors.blue2};
`;

export const Item = styled.div`
  font-size: 14px;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  width: 130px;
  height: 80px;
  border-radius: 4px;
  margin: 8px;
  padding: 8px;
  cursor: pointer;
  background: ${backgroundColor};
  will-change: transform, opacity;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  :hover {
    background: ${themeColors.blue2};
    color: white;

    ${IconStyle} {
      color: white;
    }
  }

  @media (${mediaWidths.mobile}) {
    width: 110px;
    font-size: 12px;
    margin: 4px;
  }
`;

export const Container = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  width: 100%;
`;

interface OpenChannelProps {
  setOpenCard: (card: string) => void;
}

export const OpenChannel = ({ setOpenCard }: OpenChannelProps) => {
  const [openDetails, setOpenDetails] = React.useState(false);
  const [partner, setPartner] = React.useState<BaseNode | null>(null);
  const [open, set] = React.useState(false);
  const { data, loading } = useGetBaseNodesQuery();
  const { gatewayInfo } = useGatewayState();

  React.useEffect(() => {
    if (!loading && data && data.getBaseNodes) {
      if (data.getBaseNodes.length > 0) {
        set(true);
        console.log(data.getBaseNodes);
      }
    }
  }, [loading, data]);

  if (loading) {
    return <LoadingCard noCard={true} />;
  }

  const getIcon = (name: string) => {
    switch (name) {
      case 'ThunderHub':
        return <Cpu size={18} />;
      case 'Bitrefill':
        return <ShoppingCart size={18} />;
      case 'Zap':
        return <Zap size={18} />;
      case 'Yalls':
        return <Edit size={18} />;
      case 'ACINQ':
        return <Command size={18} />;
      case 'tippin.me':
        return <Gift size={18} />;
      case 'WalletOfSatoshi':
        return <Smartphone size={18} />;
      case 'LightningTo.Me':
        return <Pocket size={18} />;
      case 'Bitfinex':
        return <TrendingUp size={18} />;
      case 'OpenNode':
        return <Box size={18} />;
      default:
        return <Hexagon size={18} />;
    }
  };

  const renderDetails = () => (
    <>
      <Separation />
      <OpenChannelCard setOpenCard={setOpenCard} />
    </>
  );

  const renderContent = () => {
    if (!partner) {
      return (
        <>
          <Container>
            {(gatewayInfo?.network === Network.Signet || Network.Regtest
              ? signetNodes
              : data?.getBaseNodes || []
            ).map(
              (item, index) =>
                item && (
                  <Item
                    key={`${index}-${item.name}`}
                    onClick={() =>
                      setPartner({
                        name: item.name,
                        public_key: item.public_key,
                        socket: item.socket,
                      })
                    }
                  >
                    <IconStyle>{getIcon(item?.name || '')}</IconStyle>
                    {item.name}
                  </Item>
                )
            )}
          </Container>
          {open && <Separation />}
          <SingleLine>
            <DarkSubTitle>Manual</DarkSubTitle>
            <ColorButton
              onClick={() => setOpenDetails(s => !s)}
              arrow={!openDetails}
            >
              {openDetails ? <X size={16} /> : 'Open'}
            </ColorButton>
          </SingleLine>
          {openDetails && renderDetails()}
        </>
      );
    } else {
      return <OpenRecommended partner={partner} setOpenCard={setOpenCard} />;
    }
  };

  return renderContent();
};
