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

const IconStyle = styled.div`
  margin-bottom: 8px;
  color: ${themeColors.blue2};
`;

const Item = styled.div`
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

const Container = styled.div`
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

  React.useEffect(() => {
    if (!loading && data && data.getBaseNodes) {
      if (data.getBaseNodes.length > 0) {
        set(true);
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
            {(data?.getBaseNodes || []).map(
              (item, index) =>
                item && (
                  <Item
                    key={`${index}-${item.name}`}
                    onClick={() => setPartner(item)}
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
