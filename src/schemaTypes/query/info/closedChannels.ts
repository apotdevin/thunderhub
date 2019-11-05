import { GraphQLObjectType, GraphQLBoolean, GraphQLString } from "graphql";
import { GraphQLInt } from "graphql";

export const ClosedChannelType = new GraphQLObjectType({
  name: "closedChannelType",
  fields: () => {
    return {
      capacity: {
        type: GraphQLInt
      },
      closeConfirmHeight: {
        type: GraphQLInt
      },
      closeTransactionId: {
        type: GraphQLString
      },
      finalLocalBalance: {
        type: GraphQLInt
      },
      finalTimeLockedBalance: {
        type: GraphQLInt
      },
      id: {
        type: GraphQLString
      },
      closeReason: {
        type: GraphQLString
      },
      partnerPublicKey: {
        type: GraphQLString
      },
      transactionId: {
        type: GraphQLString
      },
      transactionVout: {
        type: GraphQLInt
      }
    };
  }
});
