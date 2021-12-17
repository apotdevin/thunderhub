import { gql } from '@apollo/client';

export const GET_TWOFA_SECRET = gql`
  query GetTwofaSecret {
    getTwofaSecret {
      secret
      url
    }
  }
`;
