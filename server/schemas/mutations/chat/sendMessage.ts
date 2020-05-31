import { randomBytes, createHash } from 'crypto';
import {
  payViaPaymentDetails,
  getWalletInfo,
  probeForRoute,
  signMessage,
} from 'ln-service';
import { GraphQLString, GraphQLNonNull, GraphQLInt } from 'graphql';
import { ContextType } from 'server/types/apiTypes';
import { to } from 'server/helpers/async';
import { requestLimiter } from '../../../helpers/rateLimiter';
import { getAuthLnd, getCorrectAuth } from '../../../helpers/helpers';
import { defaultParams } from '../../../helpers/defaultProps';
import { createCustomRecords } from '../../../helpers/customRecords';

export const sendMessage = {
  type: GraphQLInt,
  args: {
    ...defaultParams,
    publicKey: { type: new GraphQLNonNull(GraphQLString) },
    message: { type: new GraphQLNonNull(GraphQLString) },
    messageType: { type: GraphQLString },
    tokens: { type: GraphQLInt },
    maxFee: { type: GraphQLInt },
  },
  resolve: async (_: undefined, params: any, context: ContextType) => {
    await requestLimiter(context.ip, 'sendMessage');

    const auth = getCorrectAuth(params.auth, context);
    const lnd = getAuthLnd(auth);

    if (params.maxFee) {
      const tokens = Math.max(params.tokens || 100, 100);
      const { route } = await to(
        probeForRoute({
          destination: params.publicKey,
          lnd,
          tokens,
        })
      );

      if (!route) {
        throw new Error('NoRouteFound');
      }

      if (route.safe_fee > params.maxFee) {
        throw new Error('Higher fee limit must be set');
      }
    }

    let satsToSend = params.tokens || 1;
    let messageToSend = params.message;
    if (params.messageType === 'paymentrequest') {
      satsToSend = 1;
      messageToSend = `${params.tokens},${params.message}`;
    }

    const nodeInfo = await to(
      getWalletInfo({
        lnd,
      })
    );

    const userAlias = nodeInfo.alias;
    const userKey = nodeInfo.public_key;

    const preimage = randomBytes(32);
    const secret = preimage.toString('hex');
    const id = createHash('sha256').update(preimage).digest().toString('hex');

    const messageToSign = JSON.stringify({
      sender: userKey,
      message: messageToSend,
    });

    const { signature } = await to(
      signMessage({ lnd, message: messageToSign })
    );

    const customRecords = createCustomRecords({
      message: messageToSend,
      sender: userKey,
      alias: userAlias,
      contentType: params.messageType || 'text',
      requestType: params.messageType || 'text',
      signature,
      secret,
    });

    const { safe_fee } = await to(
      payViaPaymentDetails({
        id,
        lnd,
        tokens: satsToSend,
        destination: params.publicKey,
        messages: customRecords,
      })
    );
    return safe_fee;
  },
};
