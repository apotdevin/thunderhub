import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLList,
} from 'graphql';

const RoutesType = new GraphQLObjectType({
    name: 'routeType',
    fields: () => ({
        baseFeeMTokens: { type: GraphQLString },
        channel: { type: GraphQLString },
        cltvDelta: { type: GraphQLInt },
        feeRate: { type: GraphQLInt },
        publicKey: { type: GraphQLString },
    }),
});

export const DecodeType = new GraphQLObjectType({
    name: 'decodeType',
    fields: () => {
        return {
            chainAddress: { type: GraphQLString },
            cltvDelta: { type: GraphQLInt },
            description: { type: GraphQLString },
            descriptionHash: { type: GraphQLString },
            destination: { type: GraphQLString },
            expiresAt: { type: GraphQLString },
            id: { type: GraphQLString },
            routes: { type: new GraphQLList(RoutesType) },
            tokens: { type: GraphQLInt },
        };
    },
});
