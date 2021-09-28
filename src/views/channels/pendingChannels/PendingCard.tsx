import React from 'react';
import ReactTooltip from 'react-tooltip';
import { PendingChannelType } from 'src/graphql/types';
import { blockToTime, getPercent } from '../../../utils/helpers';
import {
  Progress,
  ProgressBar,
  NodeTitle,
  StatusLine,
  MainInfo,
} from '../../../components/generic/CardGeneric';
import {
  SubCard,
  Separation,
  Sub4Title,
  ResponsiveLine,
  ResponsiveSingle,
  ResponsiveCol,
  DarkSubTitle,
} from '../../../components/generic/Styled';
import { useConfigState } from '../../../context/ConfigContext';
import {
  getStatusDot,
  getTransactionLink,
  renderLine,
  getDateDif,
  getFormatDate,
  getNodeLink,
} from '../../../components/generic/helpers';
import { getPrice } from '../../../components/price/Price';
import { usePriceState } from '../../../context/PriceContext';

interface PendingCardProps {
  channelInfo: PendingChannelType;
  index: number;
  setIndexOpen: (index: number) => void;
  indexOpen: number;
}

export const PendingCard = ({
  channelInfo,
  index,
  setIndexOpen,
  indexOpen,
}: PendingCardProps) => {
  const { currency, displayValues } = useConfigState();
  const priceContext = usePriceState();
  const format = getPrice(currency, displayValues, priceContext);

  const {
    close_transaction_id,
    is_active,
    is_closing,
    is_opening,
    local_balance,
    local_reserve,
    partner_public_key,
    received,
    remote_balance,
    remote_reserve,
    sent,
    transaction_fee,
    transaction_id,
    transaction_vout,
    partner_node_info,
    is_timelocked,
    timelock_blocks,
    timelock_expiration,
  } = channelInfo;

  const {
    alias,
    capacity,
    channel_count,
    color: nodeColor,
    updated_at,
  } = partner_node_info?.node || {};

  const formatBalance = format({ amount: local_balance + remote_balance });
  const formatLocal = format({ amount: local_balance });
  const formatRemote = format({ amount: remote_balance });
  const formatReceived = format({ amount: received });
  const formatSent = format({ amount: sent });

  const handleClick = () => {
    if (indexOpen === index) {
      setIndexOpen(0);
    } else {
      setIndexOpen(index);
    }
  };

  const renderPartner = () =>
    alias ? (
      <>
        {renderLine('Node Capacity:', capacity)}
        {renderLine('Channels:', channel_count)}
        {renderLine(
          'Last Update:',
          `${getDateDif(updated_at)} ago (${getFormatDate(updated_at)})`
        )}
      </>
    ) : (
      <DarkSubTitle>Partner node not found</DarkSubTitle>
    );

  const renderTimelock = () => {
    if (!is_timelocked) return null;
    return (
      <>
        {renderLine(
          'Total locked time',
          `${blockToTime(
            timelock_expiration || 0
          )} (${timelock_expiration} blocks)`
        )}
        {renderLine(
          'Pending locked time',
          `${blockToTime(timelock_blocks || 0)} (${timelock_blocks} blocks)`
        )}
        <Separation />
      </>
    );
  };

  const renderDetails = () => {
    return (
      <>
        <Separation />
        {renderLine('Force Closed', is_timelocked ? 'Yes' : 'No')}
        {renderTimelock()}
        {renderLine('State:', is_active ? 'Active' : 'Inactive')}
        {renderLine('Status:', is_opening ? 'Opening' : 'Closing')}
        {renderLine('Local Balance:', local_balance)}
        {renderLine('Remote Balance:', remote_balance)}
        {renderLine('Node Public Key:', getNodeLink(partner_public_key))}
        {renderLine('Transaction Id:', getTransactionLink(transaction_id))}
        {renderLine('Transaction Vout:', transaction_vout)}
        {renderLine('Transaction Fee:', transaction_fee)}
        {renderLine(
          'Close Transaction Id:',
          getTransactionLink(close_transaction_id)
        )}
        {renderLine('Local Reserve:', local_reserve)}
        {renderLine('Remote Reserve:', remote_reserve)}
        <Sub4Title>Partner Node Info</Sub4Title>
        {renderPartner()}
      </>
    );
  };

  return (
    <SubCard subColor={nodeColor} key={index}>
      <MainInfo onClick={() => handleClick()}>
        <StatusLine>
          {getStatusDot(is_active, 'active')}
          {getStatusDot(is_opening, 'opening')}
          {getStatusDot(is_closing, 'closing')}
        </StatusLine>
        <ResponsiveLine>
          <NodeTitle>{alias || partner_public_key?.substring(0, 6)}</NodeTitle>
          <ResponsiveSingle>
            {formatBalance}
            <ResponsiveCol>
              <Progress data-tip data-for={`node_balance_tip_${index}`}>
                <ProgressBar
                  percent={getPercent(local_balance, remote_balance)}
                />
              </Progress>
              <Progress data-tip data-for={`node_activity_tip_${index}`}>
                <ProgressBar order={2} percent={getPercent(received, sent)} />
              </Progress>
            </ResponsiveCol>
          </ResponsiveSingle>
        </ResponsiveLine>
      </MainInfo>
      {index === indexOpen && renderDetails()}
      <ReactTooltip
        id={`node_balance_tip_${index}`}
        effect={'solid'}
        place={'bottom'}
      >
        {renderLine('Local Balance', formatLocal)}
        {renderLine('Remote Balance', formatRemote)}
      </ReactTooltip>
      <ReactTooltip
        id={`node_activity_tip_${index}`}
        effect={'solid'}
        place={'bottom'}
      >
        {renderLine('Received', formatReceived)}
        {renderLine('Sent', formatSent)}
      </ReactTooltip>
    </SubCard>
  );
};
