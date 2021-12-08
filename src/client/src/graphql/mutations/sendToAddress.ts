import { gql } from '@apollo/client';

export const PAY_ADDRESS = gql`
  mutation PayAddress(
    $address: String!
    $tokens: Float
    $fee: Float
    $target: Float
    $sendAll: Boolean
  ) {
    sendToAddress(
      address: $address
      tokens: $tokens
      fee: $fee
      target: $target
      sendAll: $sendAll
    ) {
      confirmationCount
      id
      isConfirmed
      isOutgoing
      tokens
    }
  }
`;
