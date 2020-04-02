import { parsePaymentRequest } from 'ln-service';
import { logger } from '../../../helpers/logger';
import { requestLimiter } from '../../../helpers/rateLimiter';
import { GraphQLString, GraphQLNonNull } from 'graphql';
import { getErrorMsg, getAuthLnd } from '../../../helpers/helpers';
import { defaultParams } from '../../../helpers/defaultProps';
import { ParsePaymentType } from '../../types/MutationType';

interface RouteProps {
    base_fee_mtokens: string;
    channel: string;
    cltv_delta: number;
    fee_rate: number;
    public_key: string;
}

interface RequestProps {
    chain_addresses: string[];
    cltv_delta: number;
    created_at: string;
    description: string;
    description_hash: string;
    destination: string;
    expires_at: string;
    id: string;
    is_expired: string;
    mtokens: string;
    network: string;
    routes: RouteProps[];
    tokens: number;
}

export const parsePayment = {
    type: ParsePaymentType,
    args: {
        ...defaultParams,
        request: { type: new GraphQLNonNull(GraphQLString) },
    },
    resolve: async (root: any, params: any, context: any) => {
        await requestLimiter(context.ip, 'parsePayment');

        const lnd = getAuthLnd(params.auth);

        try {
            const request: RequestProps = await parsePaymentRequest({
                lnd,
                request: params.request,
            });

            const routes = request.routes.map((route) => {
                return {
                    mTokenFee: route.base_fee_mtokens,
                    channel: route.channel,
                    cltvDelta: route.cltv_delta,
                    feeRate: route.fee_rate,
                    publicKey: route.public_key,
                };
            });

            return {
                chainAddresses: request.chain_addresses,
                cltvDelta: request.cltv_delta,
                createdAt: request.created_at,
                description: request.description,
                descriptionHash: request.description_hash,
                destination: request.destination,
                expiresAt: request.expires_at,
                id: request.id,
                isExpired: request.is_expired,
                mTokens: request.mtokens,
                network: request.network,
                routes: routes,
                tokens: request.tokens,
            };
        } catch (error) {
            params.logger && logger.error('Error decoding request: %o', error);
            throw new Error(getErrorMsg(error));
        }
    },
};
