import {
  GraphQLObjectType,
  GraphQLBoolean,
  GraphQLString,
  GraphQLList
} from "graphql";
import { GraphQLInt } from "graphql";

const PaymentType = new GraphQLObjectType({
  name: "paymentType",
  fields: () => ({
    confirmedAt: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    createdHeight: { type: GraphQLInt },
    inChannel: { type: GraphQLString },
    isCanceled: { type: GraphQLBoolean },
    isConfirmed: { type: GraphQLBoolean },
    isHeld: { type: GraphQLBoolean },
    mtokens: { type: GraphQLString },
    pendingIndex: { type: GraphQLInt },
    tokens: { type: GraphQLInt }
  })
});

export const GetInvoiceType = new GraphQLObjectType({
  name: "getInvoiceType",
  fields: () => ({
    chainAddress: { type: GraphQLString },
    confirmedAt: { type: GraphQLString },
    createdAt: { type: GraphQLString },
    description: { type: GraphQLString },
    descriptionHash: { type: GraphQLString },
    expiresAt: { type: GraphQLString },
    id: { type: GraphQLString },
    isCanceled: { type: GraphQLBoolean },
    isConfirmed: { type: GraphQLBoolean },
    isHeld: { type: GraphQLBoolean },
    isOutgoing: { type: GraphQLBoolean },
    isPrivate: { type: GraphQLBoolean },
    payments: { type: new GraphQLList(PaymentType) },
    received: { type: GraphQLInt },
    receivedMtokens: { type: GraphQLInt },
    request: { type: GraphQLString },
    secret: { type: GraphQLString },
    tokens: { type: GraphQLInt }
  })
});
