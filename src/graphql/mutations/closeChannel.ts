import gql from 'graphql-tag';

export const CLOSE_CHANNEL = gql`
  mutation CloseChannel(
    $id: String!
    $auth: authType!
    $forceClose: Boolean
    $target: Int
    $tokens: Int
  ) {
    closeChannel(
      id: $id
      forceClose: $forceClose
      targetConfirmations: $target
      tokensPerVByte: $tokens
      auth: $auth
    ) {
      transactionId
      transactionOutputIndex
    }
  }
`;
