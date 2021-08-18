import { FC } from 'react';
import { BalanceBars, SumBar } from 'src/components/balance';
import { ProgressBar } from 'src/components/generic/CardGeneric';
import { FormatFnType } from 'src/components/price/Price';
import { useConfigState } from 'src/context/ConfigContext';
import { ChannelType } from 'src/graphql/types';
import { getPercent } from 'src/utils/helpers';
import { ChannelStatsColumn, ChannelStatsLine } from './Channel.style';
import { WUMBO_MIN_SIZE } from './Channels';

const MAX_HTLCS = 483;

const getBar = (top: number, bottom: number) => {
  const percent = (top / bottom) * 100;
  return Math.min(percent, 100);
};

type ChannelBarsProps = {
  info: ChannelType;
  format: FormatFnType;
  details: {
    biggestRateFee: number;
    biggestBaseFee: number;
    biggestPartner: number;
    mostChannels: number;
    biggest: number;
  };
};

export const ChannelBars: FC<ChannelBarsProps> = ({
  info,
  format,
  details: {
    biggestRateFee,
    biggestBaseFee,
    biggestPartner,
    mostChannels,
    biggest,
  },
}) => {
  const {
    partner_fee_info,
    partner_node_info,
    local_balance,
    remote_balance,
    pending_resume,
  } = info;

  const { incoming_amount = 200, outgoing_amount = 150 } = pending_resume;

  const { capacity: partnerNodeCapacity = 0, channel_count } =
    partner_node_info?.node || {};

  const { base_fee_mtokens, fee_rate } =
    partner_fee_info?.partner_node_policies || {};

  const { base_fee_mtokens: node_base, fee_rate: node_rate } =
    partner_fee_info?.node_policies || {};

  const { channelBarType } = useConfigState();

  const maxRate = Math.min(fee_rate || 0, 10000);
  const maxNodeRate = Math.min(node_rate || 0, 10000);

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
          <BalanceBars
            local={getBar(local_balance, biggest)}
            remote={getBar(remote_balance, biggest)}
            formatLocal={localBalance}
            formatRemote={remoteBalance}
            withBorderColor={local_balance + remote_balance > WUMBO_MIN_SIZE}
          />
        </ChannelStatsColumn>
      );
    case 'htlcs':
      return (
        <ChannelStatsColumn>
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
