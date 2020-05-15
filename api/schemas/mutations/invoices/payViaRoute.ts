import { GraphQLNonNull, GraphQLBoolean, GraphQLString } from 'graphql';
import { payViaRoutes, createInvoice } from 'ln-service';
import { ContextType } from 'api/types/apiTypes';
import { logger } from '../../../helpers/logger';
import { requestLimiter } from '../../../helpers/rateLimiter';
import {
  getAuthLnd,
  getErrorMsg,
  getCorrectAuth,
} from '../../../helpers/helpers';
import { defaultParams } from '../../../helpers/defaultProps';

export const payViaRoute = {
  type: GraphQLBoolean,
  args: {
    ...defaultParams,
    route: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (_: undefined, params: any, context: ContextType) => {
    await requestLimiter(context.ip, 'payViaRoute');

    const auth = getCorrectAuth(params.auth, context.sso);
    const lnd = getAuthLnd(auth);

    let route;
    try {
      route = JSON.parse(params.route);
    } catch (error) {
      logger.error('Corrupt route json: %o', error);
      throw new Error('Corrupt Route JSON');
    }

    const { id } = await createInvoice({
      lnd,
      tokens: params.tokens,
      description: 'Balancing Channel',
    }).catch((error: any) => {
      logger.error('Error getting invoice: %o', error);
      throw new Error(getErrorMsg(error));
    });

    await payViaRoutes({ lnd, routes: [route], id }).catch((error: any) => {
      logger.error('Error making payment: %o', error);
      throw new Error(getErrorMsg(error));
    });

    return true;
  },
};
