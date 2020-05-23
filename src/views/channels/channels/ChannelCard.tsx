import React, { useState } from 'react';
import ReactTooltip from 'react-tooltip';
import styled from 'styled-components';
import { ArrowDown, ArrowUp, EyeOff } from 'react-feather';
import { mediaWidths } from 'src/styles/Themes';
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
import {
  useConfigState,
  useConfigDispatch,
} from '../../../context/ConfigContext';
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

const IconPadding = styled.div`
  display: flex;
  flex-direction: column;
  margin-left: 8px;

  @media (${mediaWidths.mobile}) {
    display: none;
  }
`;

const StatsColumn = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
`;

const BarSide = styled.div`
  width: 50%;
  display: flex;
  flex-direction: column;
  cursor: pointer;

  @media (${mediaWidths.mobile}) {
    width: 100%;
  }
`;

const NodeTitle = styled.div`
  font-size: 16px;
  font-weight: 700;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;

  @media (${mediaWidths.mobile}) {
    text-align: center;
    margin-bottom: 8px;
  }
`;

const getSymbol = (status: boolean) => {
  return status ? <ArrowDown size={14} /> : <ArrowUp size={14} />;
};

const getPrivate = (status: boolean) => {
  return status && <EyeOff size={14} />;
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
  const { channelBarType } = useConfigState();
  const dispatch = useConfigDispatch();
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

  const handleBarClick = () => {
    dispatch({
      type: 'change',
      channelBarType: channelBarType === 'normal' ? 'partner' : 'normal',
    });
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
        {renderLine('Time Offline:', formatSeconds(time_offline))}
        {renderLine('Time Online:', formatSeconds(time_online))}
        {renderLine('Transaction Vout:', transaction_vout)}
        {renderLine('Unsettled Balance:', unsettled_balance)}
        <Sub4Title>Partner Node Info</Sub4Title>
        {renderLine('Node Capacity:', nodeCapacity)}
        {renderLine('Channel Count:', channel_count)}
        {renderLine(
          'Last Update:',
          `${getDateDif(updated_at)} ago (${getFormatDate(updated_at)})`
        )}
        {renderLine('Base Fee:', `${base_fee} mSats`)}
        {renderLine('Fee Rate:', `${fee_rate} sats/MSats`)}
        {renderLine('CTLV Delta:', cltv_delta)}
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
          <>
            <ProgressBar
              order={0}
              percent={(Number(partnerNodeCapacity) / biggestPartner) * 100}
            />
            <ProgressBar
              order={3}
              percent={(channel_count / mostChannels) * 100}
            />
            <ProgressBar
              order={1}
              percent={(base_fee / biggestBaseFee) * 100}
            />
            <ProgressBar
              order={2}
              percent={(fee_rate / biggestRateFee) * 100}
            />
          </>
        );
      default:
        return (
          <>
            <ProgressBar order={0} percent={(local_balance / biggest) * 100} />
            <ProgressBar order={1} percent={(remote_balance / biggest) * 100} />
            <ProgressBar order={2} percent={(received / biggest) * 100} />
            <ProgressBar order={3} percent={(sent / biggest) * 100} />
          </>
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
            <div>{`Partner Base Fee: ${base_fee} mSats`}</div>
            <div>{`Partner Fee Rate: ${fee_rate} sats/MSats`}</div>
          </>
        );
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

  return (
    <SubCard key={`${index}-${id}`} noCard={true}>
      <StatusLine>
        {getStatusDot(is_active, 'active')}
        {getStatusDot(is_opening, 'opening')}
        {getStatusDot(is_closing, 'closing')}
      </StatusLine>
      <ResponsiveLine>
        <NodeTitle style={{ flexGrow: 2 }}>
          <MainInfo onClick={() => handleClick()}>
            {alias || partner_public_key?.substring(0, 6)}
            <DarkSubTitle>{formatBalance}</DarkSubTitle>
          </MainInfo>
        </NodeTitle>
        <BarSide>
          <StatsColumn
            data-tip
            data-for={`node_balance_tip_${index}`}
            onClick={handleBarClick}
          >
            {renderBars()}
          </StatsColumn>
        </BarSide>
        <IconPadding>
          {getPrivate(is_private)}
          {getSymbol(is_partner_initiated)}
        </IconPadding>
      </ResponsiveLine>
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
