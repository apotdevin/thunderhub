import { GraphQLInputObjectType, GraphQLString } from 'graphql';

export const AuthType = new GraphQLInputObjectType({
    name: 'authType',
    fields: () => {
        return {
            host: {
                type: GraphQLString,
            },
            macaroon: {
                type: GraphQLString,
            },
            cert: {
                type: GraphQLString,
            },
        };
    },
});
