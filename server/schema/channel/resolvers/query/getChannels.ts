import {
  getChannels as getLnChannels,
  getNode,
  getChannel,
  getWalletInfo,
} from 'ln-service';
import { ContextType } from 'server/types/apiTypes';
import { toWithError, to } from 'server/helpers/async';
import { logger } from 'server/helpers/logger';
import { requestLimiter } from 'server/helpers/rateLimiter';
import { getAuthLnd, getCorrectAuth } from 'server/helpers/helpers';

export const getChannels = async (
  _: undefined,
  params: any,
  context: ContextType
) => {
  await requestLimiter(context.ip, 'channels');

  const auth = getCorrectAuth(params.auth, context);
  const lnd = getAuthLnd(auth);

  const [walletInfo, walletError] = await toWithError(getWalletInfo({ lnd }));
  const publicKey = walletInfo?.public_key;

  walletError &&
    logger.debug('Error getting wallet info in getChannels: %o', walletError);

  const channelList = await to(
    getLnChannels({
      lnd,
      is_active: params.active,
    })
  );

  const getChannelList = () =>
    Promise.all(
      channelList.channels.map(async channel => {
        const [nodeInfo, nodeError] = await toWithError(
          getNode({
            lnd,
            is_omitting_channels: true,
            public_key: channel.partner_public_key,
          })
        );

        const [channelInfo, channelError] = await toWithError(
          getChannel({
            lnd,
            id: channel.id,
          })
        );

        nodeError &&
          logger.debug(
            `Error getting node with public key ${channel.partner_public_key}: %o`,
            nodeError
          );

        channelError &&
          logger.debug(
            `Error getting channel with id ${channel.id}: %o`,
            channelError
          );

        let partnerFees = {};
        if (!channelError && publicKey) {
          const partnerPolicy = channelInfo.policies.filter(
            policy => policy.public_key !== publicKey
          );
          if (partnerPolicy && partnerPolicy.length >= 1) {
            partnerFees = {
              base_fee: partnerPolicy[0].base_fee_mtokens || 0,
              fee_rate: partnerPolicy[0].fee_rate || 0,
              cltv_delta: partnerPolicy[0].cltv_delta || 0,
            };
          }
        }

        const partner_node_info = {
          ...(!nodeError && nodeInfo),
          ...partnerFees,
        };

        return {
          ...channel,
          time_offline: Math.round((channel.time_offline || 0) / 1000),
          time_online: Math.round((channel.time_online || 0) / 1000),
          partner_node_info,
        };
      })
    );

  const channels = await getChannelList();
  return channels;
};
