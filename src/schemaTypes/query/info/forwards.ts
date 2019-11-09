import { GraphQLObjectType, GraphQLString } from "graphql";
import { GraphQLInt } from "graphql";

export const GetForwardType = new GraphQLObjectType({
  name: "getForwardType",
  fields: () => ({
    createdAt: { type: GraphQLString },
    fee: { type: GraphQLInt },
    feeMtokens: { type: GraphQLString },
    incomingChannel: { type: GraphQLString },
    mtokens: { type: GraphQLString },
    outgoingChannel: { type: GraphQLString },
    tokens: { type: GraphQLInt }
  })
});
