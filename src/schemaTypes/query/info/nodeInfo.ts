import {
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLString,
  GraphQLList
} from "graphql";
import { GraphQLInt } from "graphql";

export const NodeInfoType = new GraphQLObjectType({
  name: "nodeInfoType",
  fields: () => {
    return {
      chains: {
        type: new GraphQLList(GraphQLString)
      },
      color: {
        type: GraphQLString
      },
      activeChannelsCount: {
        type: GraphQLInt
      },
      alias: {
        type: GraphQLString
      },
      currentBlockHash: {
        type: GraphQLString
      },
      currentBlockHeight: {
        type: GraphQLBoolean
      },
      isSyncedToChain: {
        type: GraphQLBoolean
      },
      isSyncedToGraph: {
        type: GraphQLBoolean
      },
      latestBlockAt: {
        type: GraphQLString
      },
      peersCount: {
        type: GraphQLInt
      },
      pendingChannelsCount: {
        type: GraphQLInt
      },
      publicKey: {
        type: GraphQLString
      },
      uris: {
        type: new GraphQLList(GraphQLString)
      },
      version: {
        type: GraphQLString
      }
    };
  }
});
