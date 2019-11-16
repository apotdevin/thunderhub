import { GraphQLObjectType, GraphQLString, GraphQLFloat } from "graphql";

export const BitcoinPriceType = new GraphQLObjectType({
  name: "bitcoinPriceType",
  fields: () => {
    return {
      price: {
        type: GraphQLFloat
      },
      symbol: {
        type: GraphQLString
      }
    };
  }
});
