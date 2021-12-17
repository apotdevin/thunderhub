import { gql } from '@apollo/client';

export const SEND_MESSAGE = gql`
  mutation SendMessage(
    $publicKey: String!
    $message: String!
    $messageType: String
    $tokens: Float
    $maxFee: Float
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
