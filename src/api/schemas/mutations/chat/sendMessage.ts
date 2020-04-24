import { payViaPaymentDetails, getWalletInfo } from 'ln-service';
import { logger } from '../../../helpers/logger';
import { requestLimiter } from '../../../helpers/rateLimiter';
import {
  GraphQLString,
  GraphQLNonNull,
  GraphQLInt,
  GraphQLBoolean,
} from 'graphql';
import { getErrorMsg, getAuthLnd } from '../../../helpers/helpers';
import { defaultParams } from '../../../helpers/defaultProps';
import { createCustomRecords } from '../../../helpers/customRecords';
import { randomBytes, createHash } from 'crypto';

export const sendMessage = {
  type: GraphQLBoolean,
  args: {
    ...defaultParams,
    publicKey: { type: new GraphQLNonNull(GraphQLString) },
    messageType: { type: GraphQLString },
    tokens: { type: GraphQLInt },
    message: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (root: any, params: any, context: any) => {
    await requestLimiter(context.ip, 'sendMessage');
    const lnd = getAuthLnd(params.auth);

    let userAlias = '';
    let userKey = '';

    try {
      const nodeInfo = await getWalletInfo({
        lnd,
      });
      userAlias = nodeInfo.alias;
      userKey = nodeInfo.public_key;
    } catch (error) {
      throw new Error(getErrorMsg(error));
    }

    const preimage = randomBytes(32);
    const secret = preimage.toString('hex');
    const id = createHash('sha256').update(preimage).digest().toString('hex');

    const customRecords = createCustomRecords({
      message: params.message,
      sender: userKey,
      alias: userAlias,
      contentType: 'text',
      requestType: '',
      secret,
    });

    try {
      await payViaPaymentDetails({
        id,
        lnd,
        tokens: params.tokens,
        destination: params.publicKey,
        messages: customRecords,
      });
      //   return payment;
      return true;
    } catch (error) {
      //   params.logger &&
      logger.error('Error paying request: %o', error);
      throw new Error(getErrorMsg(error));
    }
  },
};
