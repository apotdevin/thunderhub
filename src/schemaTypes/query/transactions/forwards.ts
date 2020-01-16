import { GraphQLObjectType, GraphQLString } from 'graphql';
import { GraphQLInt } from 'graphql';

export const GetForwardType = new GraphQLObjectType({
    name: 'getForwardType',
    fields: () => ({
        created_at: { type: GraphQLString },
        fee: { type: GraphQLInt },
        fee_mtokens: { type: GraphQLString },
        incoming_channel: { type: GraphQLString },
        mtokens: { type: GraphQLString },
        outgoing_channel: { type: GraphQLString },
        tokens: { type: GraphQLInt },
    }),
});
