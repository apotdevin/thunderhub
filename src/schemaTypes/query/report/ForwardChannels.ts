import { GraphQLObjectType, GraphQLString } from "graphql";

export const ForwardChannelsType = new GraphQLObjectType({
  name: "forwardChannelType",
  fields: () => {
    return {
      incoming: {
        type: GraphQLString
      },
      outgoing: {
        type: GraphQLString
      }
    };
  }
});
