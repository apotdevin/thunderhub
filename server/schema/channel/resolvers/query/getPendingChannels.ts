import { getPendingChannels as getLnPendingChannels } from 'ln-service';
import { ContextType } from 'server/types/apiTypes';
import { to } from 'server/helpers/async';
import { requestLimiter } from 'server/helpers/rateLimiter';

interface PendingChannelListProps {
  pending_channels: PendingChannelProps[];
}

interface PendingChannelProps {
  close_transaction_id: string;
  is_active: boolean;
  is_closing: boolean;
  is_opening: boolean;
  local_balance: number;
  local_reserve: number;
  partner_public_key: string;
  received: number;
  remote_balance: number;
  remote_reserve: number;
  sent: number;
  transaction_fee: number;
  transaction_id: string;
  transaction_vout: number;
}

export const getPendingChannels = async (
  _: undefined,
  __: undefined,
  context: ContextType
) => {
  await requestLimiter(context.ip, 'pendingChannels');

  const { lnd } = context;

  const { pending_channels }: PendingChannelListProps = await to(
    getLnPendingChannels({ lnd })
  );

  return pending_channels.map(channel => ({
    ...channel,
    partner_node_info: {
      lnd,
      publicKey: channel.partner_public_key,
    },
  }));
};
