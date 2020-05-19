import gql from 'graphql-tag';

export const OPEN_CHANNEL = gql`
  mutation OpenChannel(
    $amount: Int!
    $partnerPublicKey: String!
    $auth: authType!
    $tokensPerVByte: Int
    $isPrivate: Boolean
  ) {
    openChannel(
      amount: $amount
      partnerPublicKey: $partnerPublicKey
      auth: $auth
      tokensPerVByte: $tokensPerVByte
      isPrivate: $isPrivate
    ) {
      transactionId
      transactionOutputIndex
    }
  }
`;
