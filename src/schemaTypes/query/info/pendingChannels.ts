import {
    GraphQLObjectType,
    GraphQLBoolean,
    GraphQLString,
} from 'graphql';
import { GraphQLInt } from 'graphql';
import { PartnerNodeType } from './channels';

// TODO: INCOMPLETE TYPE
export const PendingChannelType = new GraphQLObjectType({
    name: 'pendingChannelType',
    fields: () => {
        return {
            closeTransactionId: { type: GraphQLString },
            isActive: { type: GraphQLBoolean },
            isClosing: { type: GraphQLBoolean },
            isOpening: { type: GraphQLBoolean },
            localBalance: { type: GraphQLInt },
            localReserve: { type: GraphQLInt },
            partnerPublicKey: { type: GraphQLString },
            received: { type: GraphQLInt },
            remoteBalance: { type: GraphQLInt },
            remoteReserve: { type: GraphQLInt },
            sent: { type: GraphQLInt },
            partnerNodeInfo: { type: PartnerNodeType },
            transactionFee: { type: GraphQLInt },
            transactionId: { type: GraphQLString },
            transactionVout: { type: GraphQLInt },
        };
    },
});
