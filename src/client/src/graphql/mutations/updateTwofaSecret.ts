import { gql } from '@apollo/client';

export const UPDATE_TWOFA_SECRET = gql`
  mutation UpdateTwofaSecret($secret: String!, $token: String!) {
    updateTwofaSecret(secret: $secret, token: $token)
  }
`;
