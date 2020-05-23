import React, { useState } from 'react';
import ReactTooltip from 'react-tooltip';
import { ArrowDown, ArrowUp, EyeOff } from 'react-feather';
import { ChannelType } from 'src/graphql/types';
import { getPercent, formatSeconds } from '../../../utils/helpers';
import {
  ProgressBar,
  StatusLine,
  MainInfo,
} from '../../../components/generic/CardGeneric';
import {
  SubCard,
  Separation,
  Sub4Title,
  RightAlign,
  ResponsiveLine,
  DarkSubTitle,
} from '../../../components/generic/Styled';
import { useConfigState } from '../../../context/ConfigContext';
import {
  getStatusDot,
  getTooltipType,
  getFormatDate,
  getDateDif,
  renderLine,
  getTransactionLink,
  getNodeLink,
} from '../../../components/generic/helpers';
import Modal from '../../../components/modal/ReactModal';
import { CloseChannel } from '../../../components/modal/closeChannel/CloseChannel';
import { AdminSwitch } from '../../../components/adminSwitch/AdminSwitch';
import { ColorButton } from '../../../components/buttons/colorButton/ColorButton';
import { getPrice } from '../../../components/price/Price';
import { usePriceState } from '../../../context/PriceContext';
import {
  ChannelNodeTitle,
  ChannelBarSide,
  ChannelIconPadding,
  ChannelStatsColumn,
  ChannelSingleLine,
  ChannelStatsLine,
} from './Channel.style';

const getSymbol = (status: boolean) => {
  return status ? <ArrowDown size={14} /> : <ArrowUp size={14} />;
};

const getPrivate = (status: boolean) => {
  return status && <EyeOff size={14} />;
};

const getBar = (top: number, bottom: number) => {
  const percent = (top / bottom) * 100;
  return Math.min(percent, 100);
};

interface ChannelCardProps {
  channelInfo: ChannelType;
  index: number;
  setIndexOpen: (index: number) => void;
  indexOpen: number;
  biggest: number;
  biggestPartner: number;
  mostChannels: number;
  biggestBaseFee: number;
  biggestRateFee: number;
}

export const ChannelCard = ({
  channelInfo,
  index,
  setIndexOpen,
  indexOpen,
  biggest,
  biggestPartner,
  mostChannels,
  biggestBaseFee,
  biggestRateFee,
}: ChannelCardProps) => {
  const { channelBarType, channelBarStyle } = useConfigState();
  const [modalOpen, setModalOpen] = useState(false);

  const { theme, currency, displayValues } = useConfigState();
  const priceContext = usePriceState();
  const format = getPrice(currency, displayValues, priceContext);

  const tooltipType: any = getTooltipType(theme);

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
    capacity: partnerNodeCapacity = 0,
    channel_count,
    updated_at,
    base_fee,
    fee_rate,
    cltv_delta,
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

  const renderPartner = () =>
    alias ? (
      <>
        {renderLine('Node Capacity:', nodeCapacity)}
        {renderLine('Channel Count:', channel_count)}
        {renderLine(
          'Last Update:',
          `${getDateDif(updated_at)} ago (${getFormatDate(updated_at)})`
        )}
        {renderLine('Base Fee:', `${base_fee} msats`)}
        {renderLine('Fee Rate:', `${fee_rate} sats/Msats`)}
        {renderLine('CTLV Delta:', cltv_delta)}
      </>
    ) : (
      <DarkSubTitle>Partner node not found</DarkSubTitle>
    );

  const renderDetails = () => {
    return (
      <>
        <Separation />
        {renderLine('Status:', is_active ? 'Active' : 'Not Active')}
        {renderLine('Is Opening:', is_opening ? 'True' : 'False')}
        {renderLine('Is Closing:', is_closing ? 'True' : 'False')}
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
        {renderLine('Time Offline:', formatSeconds(time_offline))}
        {renderLine('Time Online:', formatSeconds(time_online))}
        {renderLine('Transaction Vout:', transaction_vout)}
        {renderLine('Unsettled Balance:', unsettled_balance)}
        <Sub4Title>Partner Node Info</Sub4Title>
        {renderPartner()}
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

  const renderBars = () => {
    switch (channelBarType) {
      case 'partner':
        return (
          <ChannelStatsColumn>
            <ProgressBar
              order={0}
              percent={getBar(Number(partnerNodeCapacity), biggestPartner)}
            />
            <ProgressBar
              order={3}
              percent={getBar(channel_count, mostChannels)}
            />
            <ProgressBar order={1} percent={getBar(base_fee, biggestBaseFee)} />
            <ProgressBar order={2} percent={getBar(fee_rate, biggestRateFee)} />
          </ChannelStatsColumn>
        );
      case 'details':
        return (
          <ChannelStatsColumn>
            <ProgressBar order={0} percent={getBar(local_balance, biggest)} />
            <ProgressBar order={1} percent={getBar(remote_balance, biggest)} />
            <ProgressBar order={2} percent={getBar(received, biggest)} />
            <ProgressBar order={3} percent={getBar(sent, biggest)} />
          </ChannelStatsColumn>
        );
      default:
        return (
          <ChannelStatsColumn>
            <ChannelStatsLine>
              <ProgressBar
                order={1}
                percent={getPercent(local_balance, remote_balance)}
              />
              <ProgressBar
                order={4}
                percent={getPercent(remote_balance, local_balance)}
              />
            </ChannelStatsLine>
            <ChannelStatsLine>
              <ProgressBar order={2} percent={getPercent(received, sent)} />
              <ProgressBar order={4} percent={getPercent(sent, received)} />
            </ChannelStatsLine>
          </ChannelStatsColumn>
        );
    }
  };

  const renderBarsInfo = () => {
    switch (channelBarType) {
      case 'partner':
        return (
          <>
            <div>{`Partner Capacity: ${nodeCapacity}`}</div>
            <div>{`Partner Channels: ${channel_count}`}</div>
            <div>{`Partner Base Fee: ${base_fee} msats`}</div>
            <div>{`Partner Fee Rate: ${fee_rate} sats/Msats`}</div>
          </>
        );
      case 'details':
      default:
        return (
          <>
            <div>{`Local Balance: ${formatLocal}`}</div>
            <div>{`Remote Balance: ${formatRemote}`}</div>
            <div>{`Received: ${formatReceived}`}</div>
            <div>{`Sent: ${formatSent}`}</div>
          </>
        );
    }
  };

  const getSubCardProps = () => {
    switch (channelBarStyle) {
      case 'ultracompact':
        return {
          withMargin: '0 0 4px 0',
          padding: index === indexOpen ? '0 0 16px' : '2px 0',
          noBackground: true,
        };
      case 'compact':
        return {
          withMargin: '0 0 4px 0',
          padding: index === indexOpen ? '4px 8px 16px' : '4px 8px',
        };
      default:
        return {};
    }
  };

  return (
    <SubCard key={`${index}-${id}`} noCard={true} {...getSubCardProps()}>
      <MainInfo onClick={() => handleClick()}>
        {channelBarStyle === 'normal' && (
          <StatusLine>
            {getStatusDot(is_active, 'active')}
            {getStatusDot(is_opening, 'opening')}
            {getStatusDot(is_closing, 'closing')}
          </StatusLine>
        )}
        <ResponsiveLine>
          <ChannelNodeTitle style={{ flexGrow: 2 }}>
            {alias || partner_public_key?.substring(0, 6)}
            {channelBarStyle !== 'ultracompact' && (
              <ChannelSingleLine>
                <DarkSubTitle>{formatBalance}</DarkSubTitle>
                <ChannelIconPadding>
                  {getPrivate(is_private)}
                  {getSymbol(is_partner_initiated)}
                </ChannelIconPadding>
              </ChannelSingleLine>
            )}
          </ChannelNodeTitle>
          <ChannelBarSide data-tip data-for={`node_balance_tip_${index}`}>
            {renderBars()}
          </ChannelBarSide>
        </ResponsiveLine>
      </MainInfo>
      {index === indexOpen && renderDetails()}
      <ReactTooltip
        id={`node_balance_tip_${index}`}
        effect={'solid'}
        place={'bottom'}
        type={tooltipType}
      >
        {renderBarsInfo()}
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
