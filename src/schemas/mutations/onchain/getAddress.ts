import { createChainAddress } from 'ln-service';
import { logger } from '../../../helpers/logger';
import { requestLimiter } from '../../../helpers/rateLimiter';
import { GraphQLNonNull, GraphQLString, GraphQLBoolean } from 'graphql';
import { getErrorMsg, getAuthLnd } from '../../../helpers/helpers';
import { AuthType } from '../../../schemaTypes/Auth';

interface AddressProps {
    address: string;
}

export const createAddress = {
    type: GraphQLString,
    args: {
        auth: { type: new GraphQLNonNull(AuthType) },
        nested: { type: GraphQLBoolean },
    },
    resolve: async (root: any, params: any, context: any) => {
        await requestLimiter(context.ip, 'getAddress');

        const lnd = getAuthLnd(params.auth);

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
