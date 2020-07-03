import React, { useState } from 'react';
import ReactTooltip from 'react-tooltip';
import {
  ArrowDown,
  ArrowUp,
  EyeOff,
  ChevronsUp,
  ChevronsDown,
  X,
} from 'react-feather';
import { ChannelType } from 'src/graphql/types';
import { BalanceBars } from 'src/components/balance';
import {
  useRebalanceState,
  useRebalanceDispatch,
} from 'src/context/RebalanceContext';
import { getPercent, formatSeconds, blockToTime } from '../../../utils/helpers';
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
  ChannelBalanceRow,
  ChannelBalanceButton,
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

export const ChannelCard: React.FC<ChannelCardProps> = ({
  channelInfo,
  index,
  setIndexOpen,
  indexOpen,
  biggest,
  biggestPartner,
  mostChannels,
  biggestBaseFee,
  biggestRateFee,
}) => {
  const dispatch = useRebalanceDispatch();
  const { inChannel, outChannel } = useRebalanceState();

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
    partner_fee_info,
    channel_age,
  } = channelInfo;

  const isIn = inChannel?.id === id;
  const isOut = outChannel?.id === id;

  const {
    alias,
    capacity: partnerNodeCapacity = 0,
    channel_count,
    updated_at,
  } = partner_node_info?.node || {};

  const { base_fee_mtokens, fee_rate, cltv_delta } =
    partner_fee_info?.channel?.partner_node_policies || {};

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

  const localBalance = format({
    amount: local_balance,
    breakNumber: true,
    noUnit: true,
  });
  const remoteBalance = format({
    amount: remote_balance,
    breakNumber: true,
    noUnit: true,
  });

  const baseFee = format({
    amount: Number(base_fee_mtokens) / 1000,
    override: 'sat',
  });
  const feeRate = format({ amount: fee_rate, override: 'ppm' });

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
        {renderLine('Base Fee:', baseFee)}
        {renderLine('Fee Rate:', `${feeRate}`)}
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
        <Separation />
        {renderLine('Local Balance:', formatLocal)}
        {renderLine('Remote Balance:', formatRemote)}
        {renderLine('Received:', formatReceived)}
        {renderLine('Sent:', formatSent)}
        {renderLine('Local Reserve:', localReserve)}
        {renderLine('Remote Reserve:', remoteReserve)}
        <Separation />
        {renderLine('Node Public Key:', getNodeLink(partner_public_key))}
        {renderLine('Transaction Id:', getTransactionLink(transaction_id))}
        <Separation />
        {renderLine('Channel Age:', blockToTime(channel_age))}
        {renderLine('Channel Block Age:', channel_age)}
        {renderLine('Channel Id:', id)}
        {renderLine('Commit Fee:', commitFee)}
        {renderLine('Commit Weight:', commitWeight)}
        <Separation />
        {renderLine(
          'Is Static Remote Key:',
          is_static_remote_key ? 'True' : 'False'
        )}
        {renderLine('Time Offline:', formatSeconds(time_offline))}
        {renderLine('Time Online:', formatSeconds(time_online))}
        {renderLine('Transaction Vout:', transaction_vout)}
        {renderLine('Unsettled Balance:', unsettled_balance)}
        <Separation />
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
      case 'fees':
        return (
          <ChannelStatsColumn>
            <ChannelStatsLine>
              <ProgressBar
                order={3}
                percent={getBar(fee_rate, biggestRateFee)}
              />
              <ProgressBar
                order={4}
                percent={getBar(biggestRateFee - fee_rate, biggestRateFee)}
              />
            </ChannelStatsLine>
            <ChannelStatsLine>
              <ProgressBar
                order={1}
                percent={getBar(Number(base_fee_mtokens), biggestBaseFee)}
              />
              <ProgressBar
                order={4}
                percent={getBar(
                  biggestBaseFee - Number(base_fee_mtokens),
                  biggestBaseFee
                )}
              />
            </ChannelStatsLine>
          </ChannelStatsColumn>
        );
      case 'size':
        return (
          <ChannelStatsColumn>
            <ChannelStatsLine>
              <ProgressBar
                order={0}
                percent={getBar(Number(partnerNodeCapacity), biggestPartner)}
              />
              <ProgressBar
                order={4}
                percent={getBar(
                  biggestPartner - Number(partnerNodeCapacity),
                  biggestPartner
                )}
              />
            </ChannelStatsLine>
            <ChannelStatsLine>
              <ProgressBar
                order={6}
                percent={getBar(channel_count, mostChannels)}
              />
              <ProgressBar
                order={4}
                percent={getBar(mostChannels - channel_count, mostChannels)}
              />
            </ChannelStatsLine>
          </ChannelStatsColumn>
        );
      case 'proportional':
        return (
          <BalanceBars
            local={getBar(local_balance, biggest)}
            remote={getBar(remote_balance, biggest)}
            formatLocal={localBalance}
            formatRemote={remoteBalance}
          />
        );
      default:
        return (
          <BalanceBars
            local={getPercent(local_balance, remote_balance)}
            remote={getPercent(remote_balance, local_balance)}
            formatLocal={localBalance}
            formatRemote={remoteBalance}
          />
        );
    }
  };

  const renderBarsInfo = () => {
    switch (channelBarType) {
      case 'fees':
        return (
          <>
            <div>{`Partner Fee Rate: ${feeRate}`}</div>
            <div>{`Partner Base Fee: ${baseFee}`}</div>
          </>
        );
      case 'size':
        return (
          <>
            <div>{`Partner Capacity: ${nodeCapacity}`}</div>
            <div>{`Partner Channels: ${channel_count}`}</div>
          </>
        );
      case 'proportional':
        return (
          <>
            <div>{`Local Balance: ${formatLocal}`}</div>
            <div>{`Remote Balance: ${formatRemote}`}</div>
          </>
        );
      default:
        return (
          <>
            <div>{`Local Balance: ${formatLocal}`}</div>
            <div>{`Remote Balance: ${formatRemote}`}</div>
          </>
        );
    }
  };

  const getSubCardProps = () => {
    switch (channelBarStyle) {
      case 'ultracompact':
      case 'balancing':
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
      <MainInfo
        disabled={channelBarStyle === 'balancing'}
        onClick={() => channelBarStyle !== 'balancing' && handleClick()}
      >
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
            {!(
              channelBarStyle === 'ultracompact' ||
              channelBarStyle === 'balancing'
            ) && (
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
            {channelBarStyle === 'balancing' && (
              <ChannelBalanceRow>
                <ChannelBalanceButton
                  selected={isOut}
                  disabled={isIn}
                  onClick={() =>
                    isOut
                      ? dispatch({ type: 'setOut', channel: null })
                      : dispatch({ type: 'setOut', channel: channelInfo })
                  }
                >
                  {isOut ? <X size={16} /> : <ChevronsUp size={16} />}
                </ChannelBalanceButton>
                <ChannelBalanceButton
                  selected={isIn}
                  disabled={isOut}
                  onClick={() =>
                    isIn
                      ? dispatch({ type: 'setIn', channel: null })
                      : dispatch({ type: 'setIn', channel: channelInfo })
                  }
                >
                  {isIn ? <X size={16} /> : <ChevronsDown size={16} />}
                </ChannelBalanceButton>
              </ChannelBalanceRow>
            )}
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
