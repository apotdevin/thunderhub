import gql from 'graphql-tag';

export const SEND_MESSAGE = gql`
  mutation SendMessage(
    $publicKey: String!
    $message: String!
    $messageType: String
    $tokens: Int
    $maxFee: Int
  ) {
    sendMessage(
      publicKey: $publicKey
      message: $message
      messageType: $messageType
      tokens: $tokens
      maxFee: $maxFee
    )
  }
`;
