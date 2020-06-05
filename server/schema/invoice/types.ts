import { gql } from 'apollo-server-micro';

export const invoiceTypes = gql`
  type parsePaymentType {
    chainAddresses: [String]
    cltvDelta: Int
    createdAt: DateTime
    description: String
    descriptionHash: String
    destination: String
    expiresAt: DateTime
    id: String
    isExpired: Boolean
    mTokens: String
    network: String
    routes: [PaymentRouteType]
    tokens: Int
  }

  type PaymentRouteType {
    mTokenFee: String
    channel: String
    cltvDelta: Int
    feeRate: Int
    publicKey: String
  }

  type payType {
    fee: Int
    fee_mtokens: String
    hops: [hopsType]
    id: String
    is_confirmed: Boolean
    is_outgoing: Boolean
    mtokens: String
    secret: String
    safe_fee: Int
    safe_tokens: Int
    tokens: Int
  }

  type hopsType {
    channel: String
    channel_capacity: Int
    fee_mtokens: String
    forward_mtokens: String
    timeout: Int
  }

  type newInvoiceType {
    chainAddress: String
    createdAt: DateTime
    description: String
    id: String
    request: String
    secret: String
    tokens: Int
  }
`;
