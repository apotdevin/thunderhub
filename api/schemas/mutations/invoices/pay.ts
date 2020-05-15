import { randomBytes, createHash } from 'crypto';
import {
  pay as payRequest,
  decodePaymentRequest,
  payViaPaymentDetails,
} from 'ln-service';
import { GraphQLString, GraphQLNonNull, GraphQLInt } from 'graphql';
import { logger } from '../../../helpers/logger';
import { requestLimiter } from '../../../helpers/rateLimiter';
import {
  getAuthLnd,
  getErrorMsg,
  getCorrectAuth,
} from '../../../helpers/helpers';
import { defaultParams } from '../../../helpers/defaultProps';
import { PayType } from '../../types/MutationType';
import { ContextType } from 'api/types/apiTypes';

const KEYSEND_TYPE = '5482373484';

interface HopProps {
  channel: string;
  channel_capacity: number;
  fee_mtokens: string;
  forward_mtokens: string;
  timeout: number;
}

interface RequestProps {
  fee: number;
  fee_mtokens: string;
  hops: HopProps[];
  id: string;
  is_confirmed: boolean;
  is_outgoing: boolean;
  mtokens: string;
  secret: string;
  safe_fee: boolean;
  safe_tokens: boolean;
  tokens: number;
}

interface DetailsProps {
  fee: number;
  fee_mtokens: string;
  hops: HopProps[];
  id: string;
  mtokens: string;
  safe_fee: boolean;
  safe_tokens: boolean;
  secret: string;
  tokens: number;
}

// TODO: Allow path payments as well
export const pay = {
  type: PayType,
  args: {
    ...defaultParams,
    request: { type: new GraphQLNonNull(GraphQLString) },
    tokens: { type: GraphQLInt },
  },
  resolve: async (_: undefined, params: any, context: ContextType) => {
    await requestLimiter(context.ip, 'pay');

    const auth = getCorrectAuth(params.auth, context.sso);
    const lnd = getAuthLnd(auth);

    let isRequest = false;
    try {
      await decodePaymentRequest({
        lnd,
        request: params.request,
      });
      isRequest = true;
    } catch (error) {
      logger.error('Error decoding request: %o', error);
    }

    if (isRequest) {
      try {
        const payment: RequestProps = await payRequest({
          lnd,
          request: params.request,
        });
        return payment;
      } catch (error) {
        logger.error('Error paying request: %o', error);
        throw new Error(getErrorMsg(error));
      }
    }

    if (!params.tokens) {
      throw new Error('Amount of tokens is needed for keysend');
    }

    const preimage = randomBytes(32);
    const secret = preimage.toString('hex');
    const id = createHash('sha256').update(preimage).digest().toString('hex');

    try {
      const payment: DetailsProps = await payViaPaymentDetails({
        id,
        lnd,
        tokens: params.tokens,
        destination: params.request,
        messages: [
          {
            type: KEYSEND_TYPE,
            value: secret,
          },
        ],
      });
      return payment;
    } catch (error) {
      logger.error('Error paying request: %o', error);
      throw new Error(getErrorMsg(error));
    }
  },
};
