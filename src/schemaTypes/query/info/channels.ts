import { GraphQLObjectType, GraphQLBoolean, GraphQLString } from "graphql";
import { GraphQLInt } from "graphql";

export const PartnerNodeType = new GraphQLObjectType({
  name: "partnerNodeType",
  fields: () => {
    return {
      alias: { type: GraphQLString },
      capacity: { type: GraphQLString },
      channelCount: { type: GraphQLInt },
      color: { type: GraphQLString },
      lastUpdate: { type: GraphQLString }
    };
  }
});

export const ChannelType = new GraphQLObjectType({
  name: "channelType",
  fields: () => {
    return {
      capacity: { type: GraphQLInt },
      commitTransactionFee: { type: GraphQLInt },
      commitTransactionWeight: { type: GraphQLInt },
      id: { type: GraphQLString },
      isActive: { type: GraphQLBoolean },
      isClosing: { type: GraphQLBoolean },
      isOpening: { type: GraphQLBoolean },
      isPartnerInitiated: { type: GraphQLBoolean },
      isPrivate: { type: GraphQLBoolean },
      isStaticRemoteKey: { type: GraphQLBoolean },
      localBalance: { type: GraphQLInt },
      localReserve: { type: GraphQLInt },
      partnerPublicKey: { type: GraphQLString },
      recieved: { type: GraphQLInt },
      remoteBalance: { type: GraphQLInt },
      remoteReserve: { type: GraphQLInt },
      sent: { type: GraphQLInt },
      timeOffline: { type: GraphQLInt },
      timeOnline: { type: GraphQLInt },
      transactionId: { type: GraphQLString },
      transactionVout: { type: GraphQLInt },
      unsettledBalance: { type: GraphQLInt },
      partnerNodeInfo: { type: PartnerNodeType }
    };
  }
});
