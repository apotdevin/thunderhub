import { GraphQLNonNull, GraphQLString, GraphQLInt } from 'graphql';
import { getRouteToDestination, getWalletInfo } from 'ln-service';
import { ContextType } from 'api/types/apiTypes';
import { logger } from '../../../helpers/logger';
import { requestLimiter } from '../../../helpers/rateLimiter';
import {
  getAuthLnd,
  getErrorMsg,
  getCorrectAuth,
} from '../../../helpers/helpers';
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
  resolve: async (_: undefined, params: any, context: ContextType) => {
    await requestLimiter(context.ip, 'getRoutes');

    const auth = getCorrectAuth(params.auth, context);
    const lnd = getAuthLnd(auth);

    const { public_key } = await getWalletInfo({ lnd });

    const { route } = await getRouteToDestination({
      lnd,
      outgoing_channel: params.outgoing,
      incoming_peer: params.incoming,
      destination: public_key,
      tokens: params.tokens,
      ...(params.maxFee && { max_fee: params.maxFee }),
    }).catch((error: any) => {
      logger.error('Error getting routes: %o', error);
      throw new Error(getErrorMsg(error));
    });

    if (!route) {
      throw new Error('NoRouteFound');
    }

    return JSON.stringify(route);
  },
};
