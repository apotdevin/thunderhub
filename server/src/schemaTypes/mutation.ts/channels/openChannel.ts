import { GraphQLObjectType, GraphQLString } from "graphql";

export const OpenChannelType = new GraphQLObjectType({
  name: "openChannelType",
  fields: () => {
    return {
      transactionId: {
        type: GraphQLString
      },
      transactionOutputIndex: {
        type: GraphQLString
      }
    };
  }
});
