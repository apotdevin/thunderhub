import { GraphQLObjectType, GraphQLBoolean, GraphQLString } from 'graphql';
import { GraphQLInt } from 'graphql';

export const PartnerNodeType = new GraphQLObjectType({
    name: 'partnerNodeType',
    fields: () => {
        return {
            alias: { type: GraphQLString },
            capacity: { type: GraphQLString },
            channel_count: { type: GraphQLInt },
            color: { type: GraphQLString },
            updated_at: { type: GraphQLString },
        };
    },
});

export const ChannelType = new GraphQLObjectType({
    name: 'channelType',
    fields: () => {
        return {
            capacity: { type: GraphQLInt },
            commit_transaction_fee: { type: GraphQLInt },
            commit_transaction_weight: { type: GraphQLInt },
            id: { type: GraphQLString },
            is_active: { type: GraphQLBoolean },
            is_closing: { type: GraphQLBoolean },
            is_opening: { type: GraphQLBoolean },
            is_partner_initiated: { type: GraphQLBoolean },
            is_private: { type: GraphQLBoolean },
            is_static_remote_key: { type: GraphQLBoolean },
            local_balance: { type: GraphQLInt },
            local_reserve: { type: GraphQLInt },
            partner_public_key: { type: GraphQLString },
            received: { type: GraphQLInt },
            remote_balance: { type: GraphQLInt },
            remote_reserve: { type: GraphQLInt },
            sent: { type: GraphQLInt },
            time_offline: { type: GraphQLInt },
            time_online: { type: GraphQLInt },
            transaction_id: { type: GraphQLString },
            transaction_vout: { type: GraphQLInt },
            unsettled_balance: { type: GraphQLInt },
            partner_node_info: { type: PartnerNodeType },
        };
    },
});
