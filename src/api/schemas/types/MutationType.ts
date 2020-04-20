import {
  GraphQLObjectType,
  GraphQLString,
  GraphQLInt,
  GraphQLList,
  GraphQLBoolean,
} from 'graphql';
import { GraphQLDateTime } from 'graphql-iso-date';

export const CloseChannelType = new GraphQLObjectType({
  name: 'closeChannelType',
  fields: () => {
    return {
      transactionId: { type: GraphQLString },
      transactionOutputIndex: { type: GraphQLString },
    };
  },
});

export const OpenChannelType = new GraphQLObjectType({
  name: 'openChannelType',
  fields: () => {
    return {
      transactionId: { type: GraphQLString },
      transactionOutputIndex: { type: GraphQLString },
    };
  },
});

export const InvoiceType = new GraphQLObjectType({
  name: 'invoiceType',
  fields: () => {
    return {
      chainAddress: { type: GraphQLString },
      createdAt: { type: GraphQLDateTime },
      description: { type: GraphQLString },
      id: { type: GraphQLString },
      request: { type: GraphQLString },
      secret: { type: GraphQLString },
      tokens: { type: GraphQLInt },
    };
  },
});

const PaymentRouteType = new GraphQLObjectType({
  name: 'PaymentRouteType',
  fields: () => ({
    mTokenFee: { type: GraphQLString },
    channel: { type: GraphQLString },
    cltvDelta: { type: GraphQLInt },
    feeRate: { type: GraphQLInt },
    publicKey: { type: GraphQLString },
  }),
});

export const ParsePaymentType = new GraphQLObjectType({
  name: 'parsePaymentType',
  fields: () => {
    return {
      chainAddresses: { type: new GraphQLList(GraphQLString) },
      cltvDelta: { type: GraphQLInt },
      createdAt: { type: GraphQLDateTime },
      description: { type: GraphQLString },
      descriptionHash: { type: GraphQLString },
      destination: { type: GraphQLString },
      expiresAt: { type: GraphQLDateTime },
      id: { type: GraphQLString },
      isExpired: { type: GraphQLBoolean },
      mTokens: { type: GraphQLString },
      network: { type: GraphQLString },
      routes: { type: new GraphQLList(PaymentRouteType) },
      tokens: { type: GraphQLInt },
    };
  },
});

const HopsType = new GraphQLObjectType({
  name: 'hopsType',
  fields: () => ({
    channel: { type: GraphQLString },
    channel_capacity: { type: GraphQLInt },
    fee_mtokens: { type: GraphQLString },
    forward_mtokens: { type: GraphQLString },
    timeout: { type: GraphQLInt },
  }),
});

export const PayType = new GraphQLObjectType({
  name: 'payType',
  fields: () => {
    return {
      fee: { type: GraphQLInt },
      fee_mtokens: { type: GraphQLString },
      hops: { type: new GraphQLList(HopsType) },
      id: { type: GraphQLString },
      is_confirmed: { type: GraphQLBoolean },
      is_outgoing: { type: GraphQLBoolean },
      mtokens: { type: GraphQLString },
      secret: { type: GraphQLString },
      safe_fee: { type: GraphQLInt },
      safe_tokens: { type: GraphQLInt },
      tokens: { type: GraphQLInt },
    };
  },
});

export const SendToType = new GraphQLObjectType({
  name: 'sendToType',
  fields: () => {
    return {
      confirmationCount: { type: GraphQLString },
      id: { type: GraphQLString },
      isConfirmed: { type: GraphQLBoolean },
      isOutgoing: { type: GraphQLBoolean },
      tokens: { type: GraphQLInt },
    };
  },
});
