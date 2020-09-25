import { gql } from '@apollo/client';

export const lnUrlTypes = gql`
  type WithdrawRequest {
    callback: String
    k1: String
    maxWithdrawable: String
    defaultDescription: String
    minWithdrawable: String
    tag: String
  }

  type PayRequest {
    callback: String
    maxSendable: String
    minSendable: String
    metadata: String
    commentAllowed: Int
    tag: String
  }

  union LnUrlRequest = WithdrawRequest | PayRequest

  type AuthResponse {
    status: String!
    message: String!
  }

  type PaySuccess {
    tag: String
    description: String
    url: String
    message: String
    ciphertext: String
    iv: String
  }
`;
