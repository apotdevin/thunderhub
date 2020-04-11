import React, { useState } from 'react';
import { getPercent } from '../../../utils/Helpers';
import {
  Progress,
  ProgressBar,
  NodeTitle,
  StatusLine,
  MainInfo,
} from '../Channels.style';
import ReactTooltip from 'react-tooltip';
import {
  SubCard,
  Separation,
  Sub4Title,
  RightAlign,
  ResponsiveLine,
  ResponsiveSingle,
  ResponsiveCol,
} from '../../../components/generic/Styled';
import { useSettings } from '../../../context/SettingsContext';
import {
  getStatusDot,
  getTooltipType,
  getFormatDate,
  getDateDif,
  renderLine,
  getTransactionLink,
  getNodeLink,
} from '../../../components/generic/Helpers';
import Modal from '../../../components/modal/ReactModal';
import { CloseChannel } from '../../../components/modal/closeChannel/CloseChannel';
import styled from 'styled-components';
import { AdminSwitch } from '../../../components/adminSwitch/AdminSwitch';
import { DownArrow, UpArrow, EyeOff } from '../../../components/generic/Icons';
import { ColorButton } from '../../../components/buttons/colorButton/ColorButton';
import { getPrice } from '../../../components/price/Price';
import { usePriceState } from '../../../context/PriceContext';

const IconPadding = styled.div`
  margin-left: 16px;
  margin-right: 8px;
`;

const getSymbol = (status: boolean) => {
  return status ? <DownArrow /> : <UpArrow />;
};

const getPrivate = (status: boolean) => {
  return status && <EyeOff />;
};

interface ChannelCardProps {
  channelInfo: any;
  index: number;
  setIndexOpen: (index: number) => void;
  indexOpen: number;
}

export const ChannelCard = ({
  channelInfo,
  index,
  setIndexOpen,
  indexOpen,
}: ChannelCardProps) => {
  const [modalOpen, setModalOpen] = useState(false);

  const { theme, currency } = useSettings();
  const priceContext = usePriceState();
  const format = getPrice(currency, priceContext);

  const tooltipType = getTooltipType(theme);

  const {
    capacity,
    commit_transaction_fee,
    commit_transaction_weight,
    id,
    is_active,
    is_closing,
    is_opening,
    is_partner_initiated,
    is_private,
    is_static_remote_key,
    local_balance,
    local_reserve,
    partner_public_key,
    received,
    remote_balance,
    remote_reserve,
    sent,
    time_offline,
    time_online,
    transaction_id,
    transaction_vout,
    unsettled_balance,
    partner_node_info,
  } = channelInfo;

  const {
    alias,
    capacity: partnerNodeCapacity,
    channel_count,
    color: nodeColor,
    updated_at,
  } = partner_node_info;

  const formatBalance = format({ amount: capacity });
  const formatLocal = format({ amount: local_balance });
  const formatRemote = format({ amount: remote_balance });
  const formatReceived = format({ amount: received });
  const formatSent = format({ amount: sent });
  const commitFee = format({ amount: commit_transaction_fee });
  const commitWeight = format({ amount: commit_transaction_weight });
  const localReserve = format({ amount: local_reserve });
  const remoteReserve = format({ amount: remote_reserve });
  const nodeCapacity = format({ amount: partnerNodeCapacity });

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
        {renderLine(
          'Balancedness:',
          getPercent(local_balance, remote_balance) / 100
        )}
        {renderLine('Local Balance:', formatLocal)}
        {renderLine('Remote Balance:', formatRemote)}
        {renderLine('Received:', formatReceived)}
        {renderLine('Sent:', formatSent)}
        {renderLine('Node Public Key:', getNodeLink(partner_public_key))}
        {renderLine('Transaction Id:', getTransactionLink(transaction_id))}
        {renderLine('Channel Id:', id)}
        {renderLine('Commit Fee:', commitFee)}
        {renderLine('Commit Weight:', commitWeight)}
        {renderLine('Is Static Remote Key:', is_static_remote_key)}
        {renderLine('Local Reserve:', localReserve)}
        {renderLine('Remote Reserve:', remoteReserve)}
        {renderLine('Time Offline:', time_offline)}
        {renderLine('Time Online:', time_online)}
        {renderLine('Transaction Vout:', transaction_vout)}
        {renderLine('Unsettled Balance:', unsettled_balance)}
        <Sub4Title>Partner Node Info</Sub4Title>
        {renderLine('Node Capacity:', nodeCapacity)}
        {renderLine('Channel Count:', channel_count)}
        {renderLine(
          'Last Update:',
          `${getDateDif(updated_at)} ago (${getFormatDate(updated_at)})`
        )}
        <AdminSwitch>
          <Separation />
          <RightAlign>
            <ColorButton
              withBorder={true}
              arrow={true}
              onClick={() => setModalOpen(true)}
            >
              Close Channel
            </ColorButton>
          </RightAlign>
        </AdminSwitch>
      </>
    );
  };

  return (
    <SubCard color={nodeColor} key={`${index}-${id}`}>
      <MainInfo onClick={() => handleClick()}>
        <StatusLine>
          {getStatusDot(is_active, 'active')}
          {getStatusDot(is_opening, 'opening')}
          {getStatusDot(is_closing, 'closing')}
        </StatusLine>
        <ResponsiveLine>
          <NodeTitle style={{ flexGrow: 2 }}>
            {alias ? alias : 'Unknown'}
          </NodeTitle>
          <ResponsiveSingle>
            {formatBalance}
            <IconPadding>
              {getPrivate(is_private)}
              {getSymbol(is_partner_initiated)}
            </IconPadding>
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
        type={tooltipType}
      >
        <div>{`Local Balance: ${formatLocal}`}</div>
        <div>{`Remote Balance: ${formatRemote}`}</div>
      </ReactTooltip>
      <ReactTooltip
        id={`node_activity_tip_${index}`}
        effect={'solid'}
        place={'bottom'}
        type={tooltipType}
      >
        <div>{`Received: ${formatReceived}`}</div>
        <div>{`Sent: ${formatSent}`}</div>
      </ReactTooltip>
      <Modal isOpen={modalOpen} closeCallback={() => setModalOpen(false)}>
        <CloseChannel
          setModalOpen={setModalOpen}
          channelId={id}
          channelName={alias}
        />
      </Modal>
    </SubCard>
  );
};
