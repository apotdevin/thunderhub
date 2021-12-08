import { FC } from 'react';
import { renderLine } from '../../../components/generic/helpers';
import { Separation, SubTitle } from '../../../components/generic/Styled';
import { FormatFnType } from '../../../components/price/Price';
import { useConfigState } from '../../../context/ConfigContext';
import { ChannelType } from '../../../graphql/types';

const MAX_HTLCS = 483;

type ChannelBarsInfoProps = {
  info: ChannelType;
  format: FormatFnType;
};

export const ChannelBarsInfo: FC<ChannelBarsInfoProps> = ({
  info: {
    local_balance,
    remote_balance,
    partner_fee_info,
    partner_node_info,
    pending_resume,
  },
  format,
}) => {
  const { channelBarType } = useConfigState();

  const {
    total_amount,
    incoming_amount = 200,
    outgoing_amount = 150,
  } = pending_resume;

  const { capacity: partnerNodeCapacity = 0, channel_count } =
    partner_node_info?.node || {};

  const { base_fee_mtokens, fee_rate } =
    partner_fee_info?.partner_node_policies || {};

  const { base_fee_mtokens: node_base, fee_rate: node_rate } =
    partner_fee_info?.node_policies || {};

  const feeRate = format({ amount: fee_rate, override: 'ppm' });
  const nodeFeeRate = format({ amount: node_rate, override: 'ppm' });

  const formatLocal = format({ amount: local_balance });
  const formatRemote = format({ amount: remote_balance });
  const nodeCapacity = format({ amount: partnerNodeCapacity });
  const baseFee = format({
    amount: Number(base_fee_mtokens) / 1000,
    override: 'sat',
  });

  const nodeBaseFee = format({
    amount: Number(node_base) / 1000,
    override: 'sat',
  });

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
