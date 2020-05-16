import { createChainAddress } from 'ln-service';
import { GraphQLString, GraphQLBoolean } from 'graphql';
import { ContextType } from 'api/types/apiTypes';
import { logger } from '../../../helpers/logger';
import { requestLimiter } from '../../../helpers/rateLimiter';
import {
  getAuthLnd,
  getErrorMsg,
  getCorrectAuth,
} from '../../../helpers/helpers';
import { defaultParams } from '../../../helpers/defaultProps';

interface AddressProps {
  address: string;
}

export const createAddress = {
  type: GraphQLString,
  args: {
    ...defaultParams,
    nested: { type: GraphQLBoolean },
  },
  resolve: async (_: undefined, params: any, context: ContextType) => {
    await requestLimiter(context.ip, 'getAddress');

    const auth = getCorrectAuth(params.auth, context);
    const lnd = getAuthLnd(auth);

    const format = params.nested ? 'np2wpkh' : 'p2wpkh';

    try {
      const address: AddressProps = await createChainAddress({
        lnd,
        is_unused: true,
        format,
      });

      return address.address;
    } catch (error) {
      logger.error('Error creating address: %o', error);
      throw new Error(getErrorMsg(error));
    }
  },
};
