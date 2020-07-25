import gql from 'graphql-tag';

export const VERIFY_MESSAGE = gql`
  query VerifyMessage($message: String!, $signature: String!) {
    verifyMessage(message: $message, signature: $signature)
  }
`;
