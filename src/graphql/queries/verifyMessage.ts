import { gql } from '@apollo/client';

export const VERIFY_MESSAGE = gql`
  query VerifyMessage($message: String!, $signature: String!) {
    verifyMessage(message: $message, signature: $signature)
  }
`;
