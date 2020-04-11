import { getFeeRates, getChannels, getNode } from 'ln-service';
import { logger } from '../../../helpers/logger';
import { requestLimiter } from '../../../helpers/rateLimiter';
import { GraphQLList } from 'graphql';
import { getAuthLnd, getErrorMsg } from '../../../helpers/helpers';
import { defaultParams } from '../../../helpers/defaultProps';
import { ChannelFeeType } from '../../types/QueryType';

interface GetChannelsProps {
  channels: ChannelsProps[];
}

interface GetFeeRatesProps {
  channels: ChannelFeesProps[];
}

interface ChannelsProps {
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

export const getChannelFees = {
  type: new GraphQLList(ChannelFeeType),
  args: defaultParams,
  resolve: async (root: any, params: any, context: any) => {
    await requestLimiter(context.ip, 'channelFees');

    const lnd = getAuthLnd(params.auth);

    try {
      const channels: GetChannelsProps = await getChannels({ lnd });

      const channelFees: GetFeeRatesProps = await getFeeRates({ lnd });

      const getConsolidated = () =>
        Promise.all(
          channels.channels.map(async channel => {
            const nodeInfo: NodeProps = await getNode({
              lnd,
              is_omitting_channels: true,
              public_key: channel.partner_public_key,
            });

            const fees = channelFees.channels.find(
              channelFee => channelFee.transaction_id === channel.transaction_id
            );
            if (!fees) return;
            const {
              base_fee,
              fee_rate,
              transaction_id,
              transaction_vout,
            } = fees;

            return {
              alias: nodeInfo.alias,
              color: nodeInfo.color,
              baseFee: base_fee,
              feeRate: fee_rate,
              transactionId: transaction_id,
              transactionVout: transaction_vout,
            };
          })
        );

      const consolidated = await getConsolidated();

      return consolidated;
    } catch (error) {
      params.logger && logger.error('Error getting channel fees: %o', error);
      throw new Error(getErrorMsg(error));
    }
  },
};
