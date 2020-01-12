import { GraphQLObjectType, GraphQLBoolean, GraphQLString } from 'graphql';
import { GraphQLInt } from 'graphql';
import { PartnerNodeType } from './channels';

// TODO: INCOMPLETE TYPE
export const PendingChannelType = new GraphQLObjectType({
    name: 'pendingChannelType',
    fields: () => {
        return {
            close_transaction_id: { type: GraphQLString },
            is_active: { type: GraphQLBoolean },
            is_closing: { type: GraphQLBoolean },
            is_opening: { type: GraphQLBoolean },
            local_balance: { type: GraphQLInt },
            local_reserve: { type: GraphQLInt },
            partner_public_key: { type: GraphQLString },
            received: { type: GraphQLInt },
            remote_balance: { type: GraphQLInt },
            remote_reserve: { type: GraphQLInt },
            sent: { type: GraphQLInt },
            transaction_fee: { type: GraphQLInt },
            transaction_id: { type: GraphQLString },
            transaction_vout: { type: GraphQLInt },
            partner_node_info: { type: PartnerNodeType },
        };
    },
});
