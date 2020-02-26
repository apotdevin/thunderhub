import { GraphQLObjectType, GraphQLInt } from 'graphql';

export const BitcoinFeeType = new GraphQLObjectType({
    name: 'bitcoinFeeType',
    fields: () => {
        return {
            fast: {
                type: GraphQLInt,
            },
            halfHour: {
                type: GraphQLInt,
            },
            hour: {
                type: GraphQLInt,
            },
        };
    },
});
