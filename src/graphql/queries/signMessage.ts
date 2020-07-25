import gql from 'graphql-tag';

export const SIGN_MESSAGE = gql`
  query SignMessage($message: String!) {
    signMessage(message: $message)
  }
`;
