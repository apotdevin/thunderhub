import { decodePaymentRequest } from 'ln-service';
import { logger } from '../../../helpers/logger';
import { requestLimiter } from '../../../helpers/rateLimiter';
import { GraphQLString, GraphQLNonNull } from 'graphql';
import { getErrorMsg, getAuthLnd } from '../../../helpers/helpers';
import { defaultParams } from '../../../helpers/defaultProps';
import { DecodeType } from '../../types/MutationType';

interface RouteProps {
  base_fee_mtokens: string;
  channel: string;
  cltv_delta: number;
  fee_rate: number;
  public_key: string;
}

interface DecodeProps {
  chain_address: string;
  cltv_delta: number;
  description: string;
  description_hash: string;
  destination: string;
  expires_at: string;
  id: string;
  routes: RouteProps[][];
  tokens: number;
}

export const decodeRequest = {
  type: DecodeType,
  args: {
    ...defaultParams,
    request: { type: new GraphQLNonNull(GraphQLString) },
  },
  resolve: async (root: any, params: any, context: any) => {
    await requestLimiter(context.ip, 'decode');

    const lnd = getAuthLnd(params.auth);

    try {
      const decode: DecodeProps = await decodePaymentRequest({
        lnd,
        request: params.request,
      });

      const routes = decode.routes.map(route => {
        route.map(nodeChannel => {
          const {
            base_fee_mtokens,
            channel,
            cltv_delta,
            fee_rate,
            public_key,
          } = nodeChannel;
          return {
            baseFeeTokens: base_fee_mtokens,
            channel,
            cltvDelta: cltv_delta,
            feeRate: fee_rate,
            publicKey: public_key,
          };
        });
      });

      const {
        chain_address,
        cltv_delta,
        description,
        description_hash,
        destination,
        expires_at,
        id,
        tokens,
      } = decode;

      return {
        chainAddress: chain_address,
        cltvDelta: cltv_delta,
        description,
        descriptionHash: description_hash,
        destination,
        expiresAt: expires_at,
        id,
        routes,
        tokens,
      };
    } catch (error) {
      params.logger && logger.error('Error paying request: %o', error);
      throw new Error(getErrorMsg(error));
    }
  },
};
