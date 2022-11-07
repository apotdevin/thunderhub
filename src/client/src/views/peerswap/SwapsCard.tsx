import React, { FC } from 'react';
import { PeerSwapSwapType } from '../../graphql/types';
import { ArrowDown, ArrowUp } from 'react-feather';
import styled from 'styled-components';
import { format } from 'date-fns';
import { chartColors, mediaWidths } from '../../styles/Themes';
import { useGetChannelQuery } from '../../graphql/queries/__generated__/getChannel.generated';
import { LoadingCard } from '../../components/loading/LoadingCard';
import { Price } from '../../components/price/Price';
import {
  getStatusDot,
  getDateDif,
  renderLine,
} from '../../components/generic/helpers';
import {
  StatusLine,
  NodeTitle,
  MainInfo,
} from '../../components/generic/CardGeneric';
import {
  Separation,
  SubCard,
  DarkSubTitle,
} from '../../components/generic/Styled';

const S = {
  icon: styled.span`
    margin-left: 4px;
  `,
  grid: styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: 3fr 2fr 2fr 1fr;

    @media (${mediaWidths.mobile}) {
      grid-template-columns: 1fr;
    }
  `,
};

const arrowStyle: React.CSSProperties = {
  top: '3px',
  marginRight: '3px',
  position: 'relative',
};

interface SwapsCardProps {
  swap: PeerSwapSwapType;
  index: number;
  setIndexOpen: (index: number) => void;
  indexOpen: number;
}

const ChannelAlias: FC<{ id: string }> = ({ id }) => {
  const { data, loading, error } = useGetChannelQuery({
    variables: { id },
  });

  if (loading) {
    return <LoadingCard noCard={true} />;
  }

  if (error) {
    return <>Unknown</>;
  }

  const alias =
    data?.getChannel.partner_node_policies?.node?.node?.alias || 'Unknown';

  return <>{alias}</>;
};

export const SwapsCard = ({
  swap,
  index,
  setIndexOpen,
  indexOpen,
}: SwapsCardProps) => {
  const {
    id,
    createdAt,
    asset,
    amount,
    channelId,
    cancelMessage,
    type,
    role,
    state,
    peerNodeId,
    openingTxId,
    claimTxId,
  } = swap;

  const handleClick = () => {
    if (indexOpen === index) {
      setIndexOpen(0);
    } else {
      setIndexOpen(index);
    }
  };

  const renderDetails = () => {
    return (
      <>
        <Separation />
        {renderLine('Id:', id)}
        {renderLine(
          'Created:',
          format(new Date(parseInt(createdAt) * 1000), 'dd/MM/yy hh:mm:ss aa')
        )}
        {renderLine('Asset:', asset)}
        {renderLine('Type:', type)}
        {renderLine('Role:', role)}
        {renderLine('State:', state)}
        {renderLine('Amount:', amount)}
        {renderLine('Peer:', peerNodeId)}
        {renderLine('Opening TX:', openingTxId)}
        {claimTxId !== '' && renderLine('Claim TX:', claimTxId)}
        {cancelMessage !== '' && renderLine('Cancel Message:', cancelMessage)}
      </>
    );
  };

  return (
    <SubCard key={index}>
      <MainInfo onClick={() => handleClick()}>
        <StatusLine>{getStatusDot(cancelMessage === '', 'active')}</StatusLine>
        <S.grid>
          <NodeTitle>
            <ChannelAlias id={channelId.replaceAll(':', 'x')} />
          </NodeTitle>
          <DarkSubTitle>
            {role === 'receiver' ? (
              <ArrowDown
                size={18}
                stroke={chartColors.purple}
                style={arrowStyle}
              />
            ) : (
              <ArrowUp
                size={18}
                stroke={chartColors.orange}
                style={arrowStyle}
              />
            )}
            {type === 'swap-in' ? 'Swap In' : 'Swap Out'}
          </DarkSubTitle>
          <DarkSubTitle>{`(${getDateDif(
            new Date(parseInt(createdAt) * 1000).toString()
          )} ago)`}</DarkSubTitle>
          <Price amount={amount} />
        </S.grid>
      </MainInfo>
      {index === indexOpen && renderDetails()}
    </SubCard>
  );
};
