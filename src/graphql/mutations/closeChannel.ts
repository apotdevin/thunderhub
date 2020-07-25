import gql from 'graphql-tag';

export const CLOSE_CHANNEL = gql`
  mutation CloseChannel(
    $id: String!
    $forceClose: Boolean
    $target: Int
    $tokens: Int
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
