import {
    GraphQLObjectType,
    GraphQLString,
    GraphQLInt,
    GraphQLList,
    GraphQLBoolean,
} from 'graphql';

const HopsType = new GraphQLObjectType({
    name: 'hopsType',
    fields: () => ({
        channel: { type: GraphQLString },
        channelCapacity: { type: GraphQLInt },
        mTokenFee: { type: GraphQLString },
        forwardMTokens: { type: GraphQLString },
        timeout: { type: GraphQLInt },
    }),
});

export const PayType = new GraphQLObjectType({
    name: 'payType',
    fields: () => {
        return {
            fee: { type: GraphQLInt },
            feeMTokens: { type: GraphQLString },
            hops: { type: new GraphQLList(HopsType) },
            id: { type: GraphQLString },
            isConfirmed: { type: GraphQLBoolean },
            isOutgoing: { type: GraphQLBoolean },
            mtokens: { type: GraphQLString },
            secret: { type: GraphQLString },
            tokens: { type: GraphQLInt },
        };
    },
});
