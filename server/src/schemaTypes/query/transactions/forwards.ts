import { GraphQLObjectType, GraphQLString, GraphQLList } from 'graphql';
import { GraphQLInt } from 'graphql';

export const ForwardType = new GraphQLObjectType({
    name: 'forwardType',
    fields: () => ({
        created_at: { type: GraphQLString },
        fee: { type: GraphQLInt },
        fee_mtokens: { type: GraphQLString },
        incoming_channel: { type: GraphQLString },
        incoming_alias: { type: GraphQLString },
        incoming_color: { type: GraphQLString },
        mtokens: { type: GraphQLString },
        outgoing_channel: { type: GraphQLString },
        outgoing_alias: { type: GraphQLString },
        outgoing_color: { type: GraphQLString },
        tokens: { type: GraphQLInt },
    }),
});

export const GetForwardType = new GraphQLObjectType({
    name: 'getForwardType',
    fields: () => ({
        token: { type: GraphQLString },
        forwards: { type: new GraphQLList(ForwardType) },
    }),
});
