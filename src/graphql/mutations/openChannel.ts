import { gql } from '@apollo/client';

export const OPEN_CHANNEL = gql`
  mutation OpenChannel(
    $amount: Int!
    $partnerPublicKey: String!
    $tokensPerVByte: Int
    $isPrivate: Boolean
    $pushTokens: Int
  ) {
    openChannel(
      amount: $amount
      partnerPublicKey: $partnerPublicKey
      tokensPerVByte: $tokensPerVByte
      isPrivate: $isPrivate
      pushTokens: $pushTokens
    ) {
      transactionId
      transactionOutputIndex
    }
  }
`;
