import { gql } from '@apollo/client';

export const OPEN_CHANNEL = gql`
  mutation OpenChannel(
    $amount: Float!
    $partnerPublicKey: String!
    $tokensPerVByte: Float
    $isPrivate: Boolean
    $pushTokens: Float
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
