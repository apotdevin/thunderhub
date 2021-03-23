import { getChannel as getLnChannel } from 'ln-service';
import { ContextType } from 'server/types/apiTypes';
import { to } from 'server/helpers/async';
import { requestLimiter } from 'server/helpers/rateLimiter';
import { GetChannelType } from 'server/types/ln-service.types';

export const getChannel = async (
  _: undefined,
  { id, pubkey }: { id: string; pubkey?: string },
  { ip, lnd }: ContextType
) => {
  await requestLimiter(ip, 'getChannel');

  const channel = await to<GetChannelType>(getLnChannel({ lnd, id }));

  if (!pubkey) {
    return channel;
  }

  let node_policies = null;
  let partner_node_policies = null;

  channel.policies.forEach(policy => {
    if (pubkey && pubkey === policy.public_key) {
      node_policies = {
        ...policy,
        node: { lnd, publicKey: policy.public_key },
      };
    } else {
      partner_node_policies = {
        ...policy,
        node: { lnd, publicKey: policy.public_key },
      };
    }
  });

  return {
    ...(channel as GetChannelType),
    node_policies,
    partner_node_policies,
  };
};
