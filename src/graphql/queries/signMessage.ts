import gql from 'graphql-tag';

export const SIGN_MESSAGE = gql`
  query SignMessage($auth: authType!, $message: String!) {
    signMessage(auth: $auth, message: $message)
  }
`;
