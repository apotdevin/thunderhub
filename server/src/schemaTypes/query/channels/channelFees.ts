import { GraphQLObjectType, GraphQLInt, GraphQLString } from 'graphql';

export const ChannelFeeType = new GraphQLObjectType({
    name: 'channelFeeType',
    fields: () => {
        return {
            alias: {
                type: GraphQLString,
            },
            color: {
                type: GraphQLString,
            },
            baseFee: {
                type: GraphQLInt,
            },
            feeRate: {
                type: GraphQLInt,
            },
            transactionId: {
                type: GraphQLString,
            },
            transactionVout: {
                type: GraphQLInt,
            },
        };
    },
});
