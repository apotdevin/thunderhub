import { GraphQLObjectType, GraphQLString, GraphQLList } from 'graphql';
import { GraphQLInt } from 'graphql';

export const GetChainTransactionsType = new GraphQLObjectType({
    name: 'getTransactionsType',
    fields: () => ({
        block_id: { type: GraphQLString },
        confirmation_count: { type: GraphQLInt },
        confirmation_height: { type: GraphQLInt },
        created_at: { type: GraphQLString },
        fee: { type: GraphQLInt },
        id: { type: GraphQLString },
        output_addresses: { type: new GraphQLList(GraphQLString) },
        tokens: { type: GraphQLInt },
    }),
});
