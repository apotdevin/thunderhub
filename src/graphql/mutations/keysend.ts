import gql from 'graphql-tag';

export const KEY_SEND = gql`
  mutation Keysend($destination: String!, $auth: authType!, $tokens: Int!) {
    keysend(destination: $destination, auth: $auth, tokens: $tokens) {
      is_confirmed
    }
  }
`;
