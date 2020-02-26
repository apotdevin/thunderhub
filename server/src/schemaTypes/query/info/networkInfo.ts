import { GraphQLObjectType, GraphQLString } from "graphql";
import { GraphQLInt } from "graphql";

export const NetworkInfoType = new GraphQLObjectType({
  name: "networkInfoType",
  fields: () => {
    return {
      averageChannelSize: {
        type: GraphQLString
      },
      channelCount: {
        type: GraphQLInt
      },
      maxChannelSize: {
        type: GraphQLString
      },
      medianChannelSize: {
        type: GraphQLString
      },
      minChannelSize: {
        type: GraphQLInt
      },
      nodeCount: {
        type: GraphQLInt
      },
      notRecentlyUpdatedPolicyCount: {
        type: GraphQLInt
      },
      totalCapacity: {
        type: GraphQLString
      }
    };
  }
});
