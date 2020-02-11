import { GraphQLNonNull, GraphQLBoolean } from 'graphql';
import { AuthType } from '../schemaTypes/Auth';

export const defaultParams = {
    auth: { type: new GraphQLNonNull(AuthType) },
    logger: { type: GraphQLBoolean },
};
