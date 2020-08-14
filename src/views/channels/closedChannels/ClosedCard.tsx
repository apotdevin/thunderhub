import React from 'react';
import styled from 'styled-components';
import { ClosedChannelType } from 'src/graphql/types';
import { blockToTime } from 'src/utils/helpers';
import { NodeTitle, MainInfo } from '../../../components/generic/CardGeneric';
import {
  SubCard,
  Separation,
  SingleLine,
  DarkSubTitle,
  ResponsiveLine,
} from '../../../components/generic/Styled';
import {
  getTransactionLink,
  renderLine,
  getNodeLink,
} from '../../../components/generic/helpers';
import { Price } from '../../../components/price/Price';

const Padding = styled.div`
  padding-left: 8px;
`;

interface PendingCardProps {
  channelInfo: ClosedChannelType;
  index: number;
  setIndexOpen: (index: number) => void;
  indexOpen: number;
}

const Column = styled.div`
  display: flex;
  flex-direction: column;
  flex-basis: 30%;
  width: 100%;
`;

export const ClosedCard = ({
  channelInfo,
  index,
  setIndexOpen,
  indexOpen,
}: PendingCardProps) => {
  const {
    capacity,
    close_confirm_height,
    close_transaction_id,
    final_local_balance,
    final_time_locked_balance,
    id,
    is_breach_close,
    is_cooperative_close,
    is_funding_cancel,
    is_local_force_close,
    is_remote_force_close,
    partner_public_key,
    transaction_id,
    transaction_vout,
    partner_node_info,
    channel_age,
  } = channelInfo;

  const { alias, color: nodeColor } = partner_node_info?.node || {};

  const formatCapacity = <Price amount={capacity} />;

  const getCloseType = (): string => {
    const types: string[] = [];

    if (is_breach_close) {
      types.push('Breach');
    }
    if (is_cooperative_close) {
      types.push('Cooperative');
    }
    if (is_funding_cancel) {
      types.push('Funding Cancel');
    }
    if (is_local_force_close) {
      types.push('Local Force Close');
    }
    if (is_remote_force_close) {
      types.push('Remote Force Close');
    }

    return types.join(', ');
  };

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
        {renderLine('Channel Id:', id)}
        {renderLine('Node Public Key:', getNodeLink(partner_public_key))}
        <Separation />
        {renderLine(
          'Close Transaction Id:',
          getTransactionLink(close_transaction_id)
        )}
        {renderLine('Transaction Id:', getTransactionLink(transaction_id))}
        {renderLine('Transaction Vout:', transaction_vout)}
        <Separation />
        {renderLine('Channel Age:', blockToTime(channel_age))}
        {renderLine('Channel Block Age:', channel_age)}
        <Separation />
        {renderLine('Close Confirm Height:', close_confirm_height)}
        {renderLine('Final Local Balance:', final_local_balance)}
        {renderLine('Final Time Lock Balance:', final_time_locked_balance)}
      </>
    );
  };

  return (
    <SubCard subColor={nodeColor} key={index}>
      <MainInfo onClick={() => handleClick()}>
        <ResponsiveLine>
          <NodeTitle>{alias || partner_public_key?.substring(0, 6)}</NodeTitle>
          <Column>
            <SingleLine>
              <DarkSubTitle>Size:</DarkSubTitle>
              <Padding>{formatCapacity}</Padding>
            </SingleLine>
            <SingleLine>
              <DarkSubTitle>Close Type:</DarkSubTitle>
              <Padding>{getCloseType()}</Padding>
            </SingleLine>
          </Column>
        </ResponsiveLine>
      </MainInfo>
      {index === indexOpen && renderDetails()}
    </SubCard>
  );
};
