import { getUtxos as getLnUtxos } from 'ln-service';
import {
  GraphQLInt,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
} from 'graphql';
import { logger } from '../../../helpers/logger';
import { requestLimiter } from '../../../helpers/rateLimiter';
import {
  getAuthLnd,
  getErrorMsg,
  getCorrectAuth,
} from '../../../helpers/helpers';
import { defaultParams } from '../../../helpers/defaultProps';
import { ContextType } from 'api/types/apiTypes';

const GetUtxosType = new GraphQLObjectType({
  name: 'getUtxosType',
  fields: () => ({
    address: { type: GraphQLString },
    address_format: { type: GraphQLString },
    confirmation_count: { type: GraphQLInt },
    output_script: { type: GraphQLString },
    tokens: { type: GraphQLInt },
    transaction_id: { type: GraphQLString },
    transaction_vout: { type: GraphQLInt },
  }),
});

export const getUtxos = {
  type: new GraphQLList(GetUtxosType),
  args: defaultParams,
  resolve: async (_: undefined, params: any, context: ContextType) => {
    await requestLimiter(context.ip, 'getUtxos');

    const auth = getCorrectAuth(params.auth, context.sso);
    const lnd = getAuthLnd(auth);

    try {
      const { utxos } = await getLnUtxos({ lnd });

      return utxos;
    } catch (error) {
      logger.error('Error getting utxos: %o', error);
      throw new Error(getErrorMsg(error));
    }
  },
};
