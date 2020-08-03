import { gql } from '@apollo/client';

export const GET_SERVER_ACCOUNTS = gql`
  query GetServerAccounts {
    getServerAccounts {
      name
      id
      loggedIn
      type
    }
  }
`;
