import { getClosedChannels as getLnClosedChannels } from 'ln-service';
import { ContextType } from 'server/types/apiTypes';
import { to } from 'server/helpers/async';
import { requestLimiter } from 'server/helpers/rateLimiter';

interface ChannelListProps {
  channels: ChannelProps[];
}

interface ChannelProps {
  capacity: number;
  close_confirm_height: number;
  close_transaction_id: string;
  final_local_balance: number;
  final_time_locked_balance: number;
  id: string;
  is_breach_close: boolean;
  is_cooperative_close: boolean;
  is_funding_cancel: boolean;
  is_local_force_close: boolean;
  is_remote_force_close: boolean;
  partner_public_key: string;
  transaction_id: string;
  transaction_vout: number;
}

export const getClosedChannels = async (
  _: undefined,
  params: any,
  context: ContextType
) => {
  await requestLimiter(context.ip, 'closedChannels');

  const { lnd } = context;

  const { channels }: ChannelListProps = await to(getLnClosedChannels({ lnd }));

  return channels.map(channel => ({
    ...channel,
    partner_node_info: {
      lnd,
      publicKey: channel.partner_public_key,
    },
  }));
};
