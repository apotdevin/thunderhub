import { FC, useState } from 'react';
import { ColorButton } from '../../../components/buttons/colorButton/ColorButton';
import {
  getDateDif,
  getFormatDate,
  getNodeLink,
  getTransactionLink,
  renderLine,
} from '../../../components/generic/helpers';
import {
  DarkSubTitle,
  Separation,
  Sub4Title,
} from '../../../components/generic/Styled';
import { ChangeDetails } from '../../../components/modal/changeDetails/ChangeDetails';
import { CloseChannel } from '../../../components/modal/closeChannel/CloseChannel';
import Modal from '../../../components/modal/ReactModal';
import { ChannelType } from '../../../graphql/types';
import {
  blockToTime,
  formatSats,
  formatSeconds,
  getPercent,
} from '../../../utils/helpers';
import { FormatFnType } from '../../../components/price/Price';
import { ChannelBosScore } from './ChannelBosScore';
import { WUMBO_MIN_SIZE } from './Channels';
import { WumboTag } from './Channel.style';
import { NodePeerSocials } from './NodePeerSocials';

type ChannelDetailsProps = {
  info: ChannelType;
  format: FormatFnType;
};

export const ChannelDetails: FC<ChannelDetailsProps> = ({
  info: {
    commit_transaction_fee,
    commit_transaction_weight,
    id,
    is_active,
    is_closing,
    is_opening,
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
    bosScore,
  },
  format,
}) => {
  const [modalOpen, setModalOpen] = useState<string>('none');

  const {
    total_amount,
    total_tokens,
    incoming_tokens,
    incoming_amount = 200,
    outgoing_tokens,
    outgoing_amount = 150,
  } = pending_resume;

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

  const formatLocal = format({ amount: local_balance });
  const formatRemote = format({ amount: remote_balance });
  const formatReceived = format({ amount: received });
  const formatSent = format({ amount: sent });
  const commitFee = format({ amount: commit_transaction_fee });
  const commitWeight = format({ amount: commit_transaction_weight });
  const localReserve = format({ amount: local_reserve });
  const remoteReserve = format({ amount: remote_reserve });
  const nodeCapacity = format({ amount: partnerNodeCapacity });

  const baseFee = format({
    amount: Number(base_fee_mtokens) / 1000,
    override: 'sat',
  });

  const nodeBaseFee = format({
    amount: Number(node_base) / 1000,
    override: 'sat',
  });

  const feeRate = format({ amount: fee_rate, override: 'ppm' });
  const nodeFeeRate = format({ amount: node_rate, override: 'ppm' });

  const max_htlc = Number(max_htlc_mtokens) / 1000;
  const min_htlc = Number(min_htlc_mtokens) / 1000;

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
        {renderLine('CLTV Delta:', cltv_delta)}
      </>
    ) : (
      <DarkSubTitle>Partner node not found</DarkSubTitle>
    );

  const renderWumboInfo = () => {
    if (local_balance + remote_balance > WUMBO_MIN_SIZE) {
      return (
        <>
          <Separation />
          <WumboTag>This channel is Wumbo!</WumboTag>
        </>
      );
    }

    return null;
  };

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
      <ChannelBosScore score={bosScore} />
      <Separation />
      {renderLine('Base Fee:', nodeBaseFee)}
      {renderLine('Fee Rate:', `${nodeFeeRate}`)}
      {renderLine('CLTV Delta:', node_cltv)}
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
      <Sub4Title>Partner Social Info</Sub4Title>
      <NodePeerSocials pubkey={partner_public_key} />
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
    </>
  );
};
