import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLBoolean,
    GraphQLList,
} from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';

const RouteType = new GraphQLObjectType({
    name: 'RouteType',
    fields: () => ({
        mTokenFee: { type: GraphQLString },
        channel: { type: GraphQLString },
        cltvDelta: { type: GraphQLInt },
        feeRate: { type: GraphQLInt },
        publicKey: { type: GraphQLString },
    }),
});

export const ParsePaymentType = new GraphQLObjectType({
    name: 'parsePaymentType',
    fields: () => {
        return {
            chainAddresses: { type: new GraphQLList(GraphQLString) },
            cltvDelta: { type: GraphQLInt },
            createdAt: { type: GraphQLDateTime },
            description: { type: GraphQLString },
            descriptionHash: { type: GraphQLString },
            destination: { type: GraphQLString },
            expiresAt: { type: GraphQLDateTime },
            id: { type: GraphQLString },
            isExpired: { type: GraphQLBoolean },
            mTokens: { type: GraphQLString },
            network: { type: GraphQLString },
            routes: { type: new GraphQLList(RouteType) },
            tokens: { type: GraphQLInt },
        };
    },
});
