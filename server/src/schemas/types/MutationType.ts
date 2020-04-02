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

const RoutesType = new GraphQLObjectType({
    name: 'routeType',
    fields: () => ({
        baseFeeMTokens: { type: GraphQLString },
        channel: { type: GraphQLString },
        cltvDelta: { type: GraphQLInt },
        feeRate: { type: GraphQLInt },
        publicKey: { type: GraphQLString },
    }),
});

export const DecodeType = new GraphQLObjectType({
    name: 'decodeType',
    fields: () => {
        return {
            chainAddress: { type: GraphQLString },
            cltvDelta: { type: GraphQLInt },
            description: { type: GraphQLString },
            descriptionHash: { type: GraphQLString },
            destination: { type: GraphQLString },
            expiresAt: { type: GraphQLString },
            id: { type: GraphQLString },
            routes: { type: new GraphQLList(RoutesType) },
            tokens: { type: GraphQLInt },
        };
    },
});

const RouteType = new GraphQLObjectType({
    name: 'RouteType',
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
            routes: { type: new GraphQLList(RouteType) },
            tokens: { type: GraphQLInt },
        };
    },
});

const HopsType = new GraphQLObjectType({
    name: 'hopsType',
    fields: () => ({
        channel: { type: GraphQLString },
        channelCapacity: { type: GraphQLInt },
        mTokenFee: { type: GraphQLString },
        forwardMTokens: { type: GraphQLString },
        timeout: { type: GraphQLInt },
    }),
});

export const PayType = new GraphQLObjectType({
    name: 'payType',
    fields: () => {
        return {
            fee: { type: GraphQLInt },
            feeMTokens: { type: GraphQLString },
            hops: { type: new GraphQLList(HopsType) },
            id: { type: GraphQLString },
            isConfirmed: { type: GraphQLBoolean },
            isOutgoing: { type: GraphQLBoolean },
            mtokens: { type: GraphQLString },
            secret: { type: GraphQLString },
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
