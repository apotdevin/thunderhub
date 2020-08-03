import { gql } from '@apollo/client';

export const KEY_SEND = gql`
  mutation Keysend($destination: String!, $tokens: Int!) {
    keysend(destination: $destination, tokens: $tokens) {
      is_confirmed
    }
  }
`;
