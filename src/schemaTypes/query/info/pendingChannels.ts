import {
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLString,
  GraphQLList
} from "graphql";
import { GraphQLInt } from "graphql";

// TODO: INCOMPLETE TYPE
export const PendingChannelType = new GraphQLObjectType({
  name: "pendingChannelType",
  fields: () => {
    return {
      closeTransactionId: {
        type: GraphQLString
      },
      isActive: {
        type: GraphQLBoolean
      },
      isClosing: {
        type: GraphQLBoolean
      },
      isOpening: {
        type: GraphQLBoolean
      },
      localBalance: {
        type: GraphQLInt
      },
      localReserve: {
        type: GraphQLInt
      },
      partnerPublicKey: {
        type: GraphQLString
      },
      received: {
        type: GraphQLInt
      },
      remoteBalance: {
        type: GraphQLInt
      },
      remoteReserve: {
        type: GraphQLInt
      },
      sent: {
        type: GraphQLInt
      }
    };
  }
});
