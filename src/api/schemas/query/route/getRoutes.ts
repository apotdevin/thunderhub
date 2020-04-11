import { GraphQLNonNull, GraphQLString, GraphQLInt } from 'graphql';
import { getRouteToDestination, getWalletInfo } from 'ln-service';
import { logger } from '../../../helpers/logger';
import { requestLimiter } from '../../../helpers/rateLimiter';
import { getAuthLnd, getErrorMsg } from '../../../helpers/helpers';
import { defaultParams } from '../../../helpers/defaultProps';

export const getRoutes = {
  type: GraphQLString,
  args: {
    ...defaultParams,
    outgoing: { type: new GraphQLNonNull(GraphQLString) },
    incoming: { type: new GraphQLNonNull(GraphQLString) },
    tokens: { type: new GraphQLNonNull(GraphQLInt) },
    maxFee: { type: GraphQLInt },
  },
  resolve: async (root: any, params: any, context: any) => {
    await requestLimiter(context.ip, 'getRoutes');

    const lnd = getAuthLnd(params.auth);

    const { public_key } = await getWalletInfo({ lnd });

    const { route } = await getRouteToDestination({
      lnd,
      outgoing_channel: params.outgoing,
      incoming_peer: params.incoming,
      destination: public_key,
      tokens: params.tokens,
      ...(params.maxFee && { max_fee: params.maxFee }),
    }).catch((error: any) => {
      params.logger && logger.error('Error getting routes: %o', error);
      throw new Error(getErrorMsg(error));
    });

    if (!route) {
      throw new Error('No route found.');
    }

    return JSON.stringify(route);
  },
};
