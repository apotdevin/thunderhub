import { GraphQLObjectType, GraphQLBoolean, GraphQLString } from 'graphql';
import { GraphQLInt } from 'graphql';
import { PartnerNodeType } from '../../../schemaTypes/query/channels/channels';

export const PeerType = new GraphQLObjectType({
    name: 'peerType',
    fields: () => {
        return {
            bytes_received: { type: GraphQLInt },
            bytes_sent: { type: GraphQLInt },
            is_inbound: { type: GraphQLBoolean },
            is_sync_peer: { type: GraphQLBoolean },
            ping_time: { type: GraphQLInt },
            public_key: { type: GraphQLString },
            socket: { type: GraphQLString },
            tokens_received: { type: GraphQLInt },
            tokens_sent: { type: GraphQLInt },
            partner_node_info: { type: PartnerNodeType },
        };
    },
});
