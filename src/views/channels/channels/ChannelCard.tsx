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
import { BalanceBars, SingleBar, SumBar } from 'src/components/balance';
import {
  useRebalanceState,
  useRebalanceDispatch,
} from 'src/context/RebalanceContext';
import { ChangeDetails } from 'src/components/modal/changeDetails/ChangeDetails';
import {
  getPercent,
  formatSeconds,
  blockToTime,
  formatSats,
} from '../../../utils/helpers';
import { ProgressBar, MainInfo } from '../../../components/generic/CardGeneric';
import {
  SubCard,
  Separation,
  Sub4Title,
  ResponsiveLine,
  DarkSubTitle,
  SubTitle,
} from '../../../components/generic/Styled';
import { useConfigState } from '../../../context/ConfigContext';
import {
  getFormatDate,
  getDateDif,
  renderLine,
  getTransactionLink,
  getNodeLink,
} from '../../../components/generic/helpers';
import Modal from '../../../components/modal/ReactModal';
import { CloseChannel } from '../../../components/modal/closeChannel/CloseChannel';
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
  WumboTag,
  ChannelAlias,
} from './Channel.style';
import { WUMBO_MIN_SIZE } from './Channels';
import { getTitleColor } from './helpers';

const MAX_HTLCS = 483;

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
  setIndexOpen: (indexNumber: number) => void;
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

  const { channelBarType, channelBarStyle, subBar } = useConfigState();
  const [modalOpen, setModalOpen] = useState<string>('none');

  const { currency, displayValues } = useConfigState();
  const priceContext = usePriceState();
  const format = getPrice(currency, displayValues, priceContext);

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
    pending_resume,
  } = channelInfo;

  const {
    total_amount,
    total_tokens,
    incoming_tokens,
    incoming_amount = 200,
    outgoing_tokens,
    outgoing_amount = 150,
  } = pending_resume;

  const isIn = inChannel?.id === id;
  const isOut = outChannel?.id === id;

  const {
    alias,
    capacity: partnerNodeCapacity = 0,
    channel_count,
    updated_at,
  } = partner_node_info?.node || {};

  const { base_fee_mtokens, fee_rate, cltv_delta } =
    partner_fee_info?.partner_node_policies || {};

  const {
    base_fee_mtokens: node_base,
    fee_rate: node_rate,
    cltv_delta: node_cltv,
    max_htlc_mtokens,
    min_htlc_mtokens,
  } = partner_fee_info?.node_policies || {};

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

  const nodeBaseFee = format({
    amount: Number(node_base) / 1000,
    override: 'sat',
  });

  const maxRate = Math.min(fee_rate || 0, 10000);
  const feeRate = format({ amount: fee_rate, override: 'ppm' });

  const maxNodeRate = Math.min(node_rate || 0, 10000);
  const nodeFeeRate = format({ amount: node_rate, override: 'ppm' });

  const max_htlc = Number(max_htlc_mtokens) / 1000;
  const min_htlc = Number(min_htlc_mtokens) / 1000;

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

  const renderWumboInfo = () => {
    if (local_balance + remote_balance >= WUMBO_MIN_SIZE) {
      return (
        <>
          <Separation />
          <WumboTag>This channel is Wumbo!</WumboTag>
        </>
      );
    }

    return null;
  };

  const renderDetails = () => {
    return (
      <>
        {renderWumboInfo()}
        <Separation />
        {renderLine('Status:', is_active ? 'Active' : 'Not Active')}
        {renderLine('Is Opening:', is_opening ? 'True' : 'False')}
        {renderLine('Is Closing:', is_closing ? 'True' : 'False')}
        {renderLine(
          'Balancedness:',
          getPercent(local_balance, remote_balance) / 100
        )}
        <Separation />
        {renderLine('Base Fee:', nodeBaseFee)}
        {renderLine('Fee Rate:', `${nodeFeeRate}`)}
        {renderLine('CTLV Delta:', node_cltv)}
        {renderLine('Max HTLC (sats)', formatSats(max_htlc))}
        {renderLine('Min HTLC (sats)', formatSats(min_htlc))}
        <ColorButton
          fullWidth={true}
          withBorder={true}
          arrow={true}
          onClick={() => setModalOpen('details')}
        >
          Update Details
        </ColorButton>
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
        <Sub4Title>Pending HTLCS</Sub4Title>
        {!total_amount && renderLine('Total Amount', 'None')}
        {renderLine('Total Amount', total_amount)}
        {renderLine('Total Tokens', total_tokens)}
        {renderLine('Incoming Tokens', incoming_tokens)}
        {renderLine('Outgoing Tokens', outgoing_tokens)}
        {renderLine('Incoming Amount', incoming_amount)}
        {renderLine('Outgoing Amount', outgoing_amount)}
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
        <Separation />
        <ColorButton
          fullWidth={true}
          withBorder={true}
          arrow={true}
          onClick={() => setModalOpen('close')}
        >
          Close Channel
        </ColorButton>
      </>
    );
  };

  const renderBars = () => {
    switch (channelBarType) {
      case 'fees':
        return (
          <ChannelStatsColumn>
            <BalanceBars
              local={getBar(maxNodeRate, biggestRateFee)}
              remote={getBar(maxRate, biggestRateFee)}
              height={10}
            />
            <BalanceBars
              local={getBar(Number(node_base), biggestBaseFee)}
              remote={getBar(Number(base_fee_mtokens), biggestBaseFee)}
              height={10}
            />
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
            {channel_count && (
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
            )}
          </ChannelStatsColumn>
        );
      case 'proportional':
        return (
          <ChannelStatsColumn>
            {subBar === 'fees' && (
              <SingleBar value={getBar(maxRate, 2000)} height={4} />
            )}
            <BalanceBars
              local={getBar(local_balance, biggest)}
              remote={getBar(remote_balance, biggest)}
              formatLocal={localBalance}
              formatRemote={remoteBalance}
              withBorderColor={local_balance + remote_balance >= WUMBO_MIN_SIZE}
            />
          </ChannelStatsColumn>
        );
      case 'htlcs':
        return (
          <ChannelStatsColumn>
            {subBar === 'fees' && (
              <SingleBar value={getBar(maxRate, 2000)} height={4} />
            )}
            <SumBar
              values={[
                getPercent(incoming_amount, MAX_HTLCS - incoming_amount),
                getPercent(outgoing_amount, MAX_HTLCS - outgoing_amount),
              ]}
            />
          </ChannelStatsColumn>
        );
      default:
        return (
          <ChannelStatsColumn>
            {subBar === 'fees' && (
              <SingleBar value={getBar(maxRate, 2000)} height={4} />
            )}
            <BalanceBars
              local={getPercent(local_balance, remote_balance)}
              remote={getPercent(remote_balance, local_balance)}
              formatLocal={localBalance}
              formatRemote={remoteBalance}
            />
          </ChannelStatsColumn>
        );
    }
  };

  const renderBarsInfo = () => {
    switch (channelBarType) {
      case 'fees':
        return (
          <>
            {renderLine('Fee Rate', nodeFeeRate)}
            {renderLine('Partner Fee Rate', feeRate)}
            <Separation />
            {renderLine('Base Fee', nodeBaseFee)}
            {renderLine('Partner Base Fee', baseFee)}
          </>
        );
      case 'size':
        return (
          <>
            {renderLine('Partner Capacity', nodeCapacity)}
            {renderLine('Partner Channels', channel_count)}
          </>
        );
      case 'proportional':
        return (
          <>
            {renderLine('Local Balance', formatLocal)}
            {renderLine('Remote Balance', formatRemote)}
          </>
        );
      case 'htlcs':
        return (
          <>
            <SubTitle>Pending HTLCS</SubTitle>
            {renderLine('Total', `${total_amount}/${MAX_HTLCS}`)}
            {renderLine(
              'Incoming',
              `${incoming_amount}/${MAX_HTLCS - outgoing_amount}`
            )}
            {renderLine(
              'Outgoing',
              `${outgoing_amount}/${MAX_HTLCS - incoming_amount}`
            )}
          </>
        );
      default:
        return (
          <>
            {renderLine('Local Balance', formatLocal)}
            {renderLine('Remote Balance', formatRemote)}
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
        <ResponsiveLine>
          <ChannelNodeTitle
            style={{ flexGrow: 2 }}
            data-tip
            data-for={`node_status_tip_${index}`}
          >
            <ChannelAlias
              textColor={getTitleColor(is_active, is_opening, is_closing)}
            >
              {alias || partner_public_key?.substring(0, 6)}
            </ChannelAlias>
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
        id={`node_status_tip_${index}`}
        effect={'solid'}
        place={'bottom'}
      >
        {renderLine('Status:', is_active ? 'Active' : 'Not Active')}
        {is_opening && renderLine('Is Opening:', 'True')}
        {is_closing && renderLine('Is Closing:', 'True')}
      </ReactTooltip>
      <ReactTooltip
        id={`node_balance_tip_${index}`}
        effect={'solid'}
        place={'bottom'}
      >
        {renderBarsInfo()}
      </ReactTooltip>
      <Modal
        isOpen={modalOpen !== 'none'}
        closeCallback={() => setModalOpen('none')}
      >
        {modalOpen === 'close' ? (
          <CloseChannel
            callback={() => setModalOpen('none')}
            channelId={id}
            channelName={alias}
          />
        ) : (
          <ChangeDetails
            callback={() => setModalOpen('none')}
            transaction_id={transaction_id}
            transaction_vout={transaction_vout}
            base_fee_mtokens={node_base}
            max_htlc_mtokens={max_htlc_mtokens}
            min_htlc_mtokens={min_htlc_mtokens}
            fee_rate={node_rate}
            cltv_delta={node_cltv}
          />
        )}
      </Modal>
    </SubCard>
  );
};
