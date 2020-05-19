import gql from 'graphql-tag';

export const VERIFY_MESSAGE = gql`
  query VerifyMessage(
    $auth: authType!
    $message: String!
    $signature: String!
  ) {
    verifyMessage(auth: $auth, message: $message, signature: $signature)
  }
`;
