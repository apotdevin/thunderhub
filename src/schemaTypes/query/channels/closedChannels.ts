import { GraphQLObjectType, GraphQLBoolean, GraphQLString } from 'graphql';
import { GraphQLInt } from 'graphql';

export const ClosedChannelType = new GraphQLObjectType({
    name: 'closedChannelType',
    fields: () => {
        return {
            capacity: { type: GraphQLInt },
            close_confirm_height: { type: GraphQLInt },
            close_transaction_id: { type: GraphQLString },
            final_local_balance: { type: GraphQLInt },
            final_time_locked_balance: { type: GraphQLInt },
            id: { type: GraphQLString },
            is_breach_close: { type: GraphQLBoolean },
            is_cooperative_close: { type: GraphQLBoolean },
            is_funding_cancel: { type: GraphQLBoolean },
            is_local_force_close: { type: GraphQLBoolean },
            is_remote_force_close: { type: GraphQLBoolean },
            partner_public_key: { type: GraphQLString },
            transaction_id: { type: GraphQLString },
            transaction_vout: { type: GraphQLInt },
        };
    },
});
