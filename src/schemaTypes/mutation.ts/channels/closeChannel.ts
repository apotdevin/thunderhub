import { GraphQLObjectType, GraphQLString } from "graphql";

export const CloseChannelType = new GraphQLObjectType({
  name: "closeChannelType",
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
