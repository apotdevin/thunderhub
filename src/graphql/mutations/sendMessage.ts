import gql from 'graphql-tag';

export const SEND_MESSAGE = gql`
  mutation SendMessage(
    $auth: authType!
    $publicKey: String!
    $message: String!
    $messageType: String
    $tokens: Int
    $maxFee: Int
  ) {
    sendMessage(
      auth: $auth
      publicKey: $publicKey
      message: $message
      messageType: $messageType
      tokens: $tokens
      maxFee: $maxFee
    )
  }
`;
