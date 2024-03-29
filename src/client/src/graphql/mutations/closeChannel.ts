import { gql } from '@apollo/client';

export const CLOSE_CHANNEL = gql`
  mutation CloseChannel(
    $id: String!
    $forceClose: Boolean
    $target: Float
    $tokens: Float
  ) {
    closeChannel(
      id: $id
      forceClose: $forceClose
      targetConfirmations: $target
      tokensPerVByte: $tokens
    ) {
      transactionId
      transactionOutputIndex
    }
  }
`;
