import { gql } from '@apollo/client';

export const GET_SERVER_ACCOUNTS = gql`
  query GetServerAccounts {
    public {
      get_server_accounts {
        name
        id
        loggedIn
        type
      }
    }
  }
`;
