import { gql } from '@apollo/client';

export const REMOVE_TWOFA_SECRET = gql`
  mutation RemoveTwofaSecret($token: String!) {
    removeTwofaSecret(token: $token)
  }
`;
