import { getChannels, getWalletInfo } from 'ln-service';
import { ContextType } from 'server/types/apiTypes';
import { requestLimiter } from 'server/helpers/rateLimiter';
import { getLnd } from 'server/helpers/helpers';
import { to } from 'server/helpers/async';

interface GetChannelsProps {
  channels: ChannelsProps[];
}

interface GetFeeRatesProps {
  channels: ChannelFeesProps[];
}

interface ChannelsProps {
  id: string;
  partner_public_key: number;
  transaction_id: string;
}

interface ChannelFeesProps {
  base_fee: number;
  fee_rate: number;
  transaction_id: string;
  transaction_vout: number;
}

interface NodeProps {
  alias: string;
  color: string;
}

export const getChannelFees = async (
  _: undefined,
  params: any,
  context: ContextType
) => {
  await requestLimiter(context.ip, 'channelFees');

  const lnd = getLnd(params.auth, context);

  const { public_key } = await to(getWalletInfo({ lnd }));
  const { channels }: GetChannelsProps = await to(getChannels({ lnd }));

  return channels
    .map(channel => {
      const { id, partner_public_key } = channel;
      return {
        id,
        partner_public_key,
        partner_node_info: { lnd, publicKey: partner_public_key },
        channelInfo: { lnd, id, localKey: public_key },
      };
    })
    .filter(Boolean);
};
