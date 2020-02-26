import {
    GraphQLObjectType,
    GraphQLBoolean,
    GraphQLString,
    GraphQLList,
} from 'graphql';
import { GraphQLInt } from 'graphql';

export const NodeInfoType = new GraphQLObjectType({
    name: 'nodeInfoType',
    fields: () => {
        return {
            chains: { type: new GraphQLList(GraphQLString) },
            color: { type: GraphQLString },
            active_channels_count: { type: GraphQLInt },
            closed_channels_count: { type: GraphQLInt },
            alias: { type: GraphQLString },
            current_block_hash: { type: GraphQLString },
            current_block_height: { type: GraphQLBoolean },
            is_synced_to_chain: { type: GraphQLBoolean },
            is_synced_to_graph: { type: GraphQLBoolean },
            latest_block_at: { type: GraphQLString },
            peers_count: { type: GraphQLInt },
            pending_channels_count: { type: GraphQLInt },
            public_key: { type: GraphQLString },
            uris: { type: new GraphQLList(GraphQLString) },
            version: { type: GraphQLString },
        };
    },
});
