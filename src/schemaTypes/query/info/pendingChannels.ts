import {
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLString,
  GraphQLList
} from "graphql";
import { GraphQLInt } from "graphql";
import { PartnerNodeType } from "./channels";

// TODO: INCOMPLETE TYPE
export const PendingChannelType = new GraphQLObjectType({
  name: "pendingChannelType",
  fields: () => {
    return {
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
      partnerNodeInfo: { type: PartnerNodeType }
    };
  }
});
