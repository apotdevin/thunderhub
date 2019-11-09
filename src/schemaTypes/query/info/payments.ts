import {
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLString,
  GraphQLList
} from "graphql";
import { GraphQLInt } from "graphql";

export const GetPaymentType = new GraphQLObjectType({
  name: "getPaymentType",
  fields: () => ({
    createdAt: { type: GraphQLString },
    destination: { type: GraphQLString },
    fee: { type: GraphQLInt },
    feeMtokens: { type: GraphQLString },
    hops: { type: new GraphQLList(GraphQLString) },
    id: { type: GraphQLString },
    isConfirmed: { type: GraphQLBoolean },
    isOutgoing: { type: GraphQLBoolean },
    mtokens: { type: GraphQLString },
    request: { type: GraphQLString },
    secret: { type: GraphQLString },
    tokens: { type: GraphQLInt }
  })
});
