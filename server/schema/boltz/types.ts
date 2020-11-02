import { gql } from '@apollo/client';

export const boltzTypes = gql`
  type BoltzInfoType {
    max: Int!
    min: Int!
    feePercent: Float!
  }

  type BoltzSwapTransaction {
    id: String
    hex: String
    eta: Int
  }

  type BoltzSwapStatus {
    status: String!
    transaction: BoltzSwapTransaction
  }

  type BoltzSwap {
    id: String
    boltz: BoltzSwapStatus
  }

  type CreateBoltzReverseSwapType {
    id: String!
    invoice: String!
    redeemScript: String!
    onchainAmount: Int!
    timeoutBlockHeight: Int!
    lockupAddress: String!
    minerFeeInvoice: String
    decodedInvoice: decodeType
    receivingAddress: String!
    preimage: String
    preimageHash: String
    privateKey: String
    publicKey: String
  }
`;
