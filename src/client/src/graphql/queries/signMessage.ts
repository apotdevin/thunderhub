import { gql } from '@apollo/client';

export const SIGN_MESSAGE = gql`
  query SignMessage($message: String!) {
    signMessage(message: $message)
  }
`;
