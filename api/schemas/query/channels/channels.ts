import { GraphQLList, GraphQLBoolean } from 'graphql';
import {
  getChannels as getLnChannels,
  getNode,
  getChannel,
  getWalletInfo,
} from 'ln-service';
import { ContextType } from 'api/types/apiTypes';
import { toWithError } from 'api/helpers/async';
import { logger } from '../../../helpers/logger';
import { requestLimiter } from '../../../helpers/rateLimiter';
import {
  getAuthLnd,
  getErrorMsg,
  getCorrectAuth,
} from '../../../helpers/helpers';
import { defaultParams } from '../../../helpers/defaultProps';
import { ChannelType } from '../../types/QueryType';

export const getChannels = {
  type: new GraphQLList(ChannelType),
  args: {
    ...defaultParams,
    active: { type: GraphQLBoolean },
  },
  resolve: async (_: undefined, params: any, context: ContextType) => {
    await requestLimiter(context.ip, 'channels');

    const auth = getCorrectAuth(params.auth, context);
    const lnd = getAuthLnd(auth);

    const [walletInfo, walletError] = await toWithError(getWalletInfo({ lnd }));
    const publicKey = walletInfo?.public_key;

    walletError &&
      logger.debug('Error getting wallet info in getChannels: %o', walletError);

    const [channelList, channelListError] = await toWithError(
      getLnChannels({
        lnd,
        is_active: params.active,
      })
    );

    if (channelListError) {
      logger.error('Error getting channels: %o', channelListError);
      throw new Error(getErrorMsg(channelListError));
    }

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
          if (!channelError) {
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
            ...(nodeError ? {} : nodeInfo),
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
  },
};
