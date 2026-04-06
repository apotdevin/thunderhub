import { gql } from '@apollo/client';

export const GET_ACCOUNT = gql`
  query GetAccount {
    getAccount {
      name
      id
      slug
      loggedIn
      type
      twofaEnabled
      hasNode
    }
  }
`;
