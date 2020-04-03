import { GraphQLNonNull, GraphQLBoolean } from 'graphql';
import { AuthType } from '../schemas/types/GeneralType';

export const defaultParams = {
    auth: { type: new GraphQLNonNull(AuthType) },
    logger: { type: GraphQLBoolean },
};
