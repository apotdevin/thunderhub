import { gql } from '@apollo/client';

export const KEY_SEND = gql`
  mutation Keysend($destination: String!, $tokens: Float!, $message: String) {
    keysend(destination: $destination, tokens: $tokens, message: $message) {
      is_confirmed
    }
  }
`;
