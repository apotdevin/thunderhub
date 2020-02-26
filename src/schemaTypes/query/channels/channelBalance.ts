import { GraphQLObjectType } from 'graphql';
import { GraphQLInt } from 'graphql';

export const ChannelBalanceType = new GraphQLObjectType({
    name: 'channelBalanceType',
    fields: () => {
        return {
            confirmedBalance: {
                type: GraphQLInt,
            },
            pendingBalance: {
                type: GraphQLInt,
            },
        };
    },
});
