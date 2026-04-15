import { gql } from '@apollo/client';

export const GET_SERVER_ACCOUNTS = gql`
  query GetServerAccounts {
    public {
      id
      get_server_accounts {
        name
        id
        slug
        type
      }
    }
  }
`;
