import {
  getClosedChannels as getLnClosedChannels,
  getWalletInfo,
} from 'ln-service';
import { ContextType } from 'server/types/apiTypes';
import { to } from 'server/helpers/async';
import { requestLimiter } from 'server/helpers/rateLimiter';
import { getChannelAge } from 'server/schema/health/helpers';

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
  __: any,
  context: ContextType
) => {
  await requestLimiter(context.ip, 'closedChannels');

  const { lnd } = context;

  const { current_block_height } = await to(getWalletInfo({ lnd }));
  const { channels }: ChannelListProps = await to(getLnClosedChannels({ lnd }));

  return channels.map(channel => ({
    ...channel,
    partner_node_info: {
      lnd,
      publicKey: channel.partner_public_key,
    },
    channel_age: getChannelAge(channel.id, current_block_height),
  }));
};
