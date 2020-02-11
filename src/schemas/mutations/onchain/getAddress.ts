import { createChainAddress } from 'ln-service';
import { logger } from '../../../helpers/logger';
import { requestLimiter } from '../../../helpers/rateLimiter';
import { GraphQLString, GraphQLBoolean } from 'graphql';
import { getErrorMsg, getAuthLnd } from '../../../helpers/helpers';
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
            params.logger && logger.error('Error creating address: %o', error);
            throw new Error(getErrorMsg(error));
        }
    },
};
