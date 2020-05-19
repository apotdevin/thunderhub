import gql from 'graphql-tag';

export const PAY_ADDRESS = gql`
  mutation PayAddress(
    $auth: authType!
    $address: String!
    $tokens: Int
    $fee: Int
    $target: Int
    $sendAll: Boolean
  ) {
    sendToAddress(
      auth: $auth
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
