import { getUtxos as getLnUtxos } from 'ln-service';
import {
  GraphQLInt,
  GraphQLObjectType,
  GraphQLString,
  GraphQLList,
} from 'graphql';
import { logger } from '../../../helpers/logger';
import { requestLimiter } from '../../../helpers/rateLimiter';
import { getAuthLnd, getErrorMsg } from '../../../helpers/helpers';
import { defaultParams } from '../../../helpers/defaultProps';

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
  resolve: async (root: any, params: any, context: any) => {
    await requestLimiter(context.ip, 'getUtxos');

    const lnd = getAuthLnd(params.auth);

    try {
      const { utxos } = await getLnUtxos({ lnd });

      return utxos;
    } catch (error) {
      logger.error('Error getting utxos: %o', error);
      throw new Error(getErrorMsg(error));
    }
  },
};
