import { gql } from '@apollo/client';

export const PAY_ADDRESS = gql`
  mutation PayAddress(
    $address: String!
    $tokens: Int
    $fee: Int
    $target: Int
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
