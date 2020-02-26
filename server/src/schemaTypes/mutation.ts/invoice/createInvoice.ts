import { GraphQLObjectType, GraphQLString, GraphQLInt } from "graphql";
import { GraphQLDateTime } from "graphql-iso-date";

export const InvoiceType = new GraphQLObjectType({
  name: "invoiceType",
  fields: () => {
    return {
      chainAddress: { type: GraphQLString },
      createdAt: { type: GraphQLDateTime },
      description: { type: GraphQLString },
      id: { type: GraphQLString },
      request: { type: GraphQLString },
      secret: { type: GraphQLString },
      tokens: { type: GraphQLInt }
    };
  }
});
