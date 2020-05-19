import gql from 'graphql-tag';

export const GET_SERVER_ACCOUNTS = gql`
  query GetServerAccounts {
    getServerAccounts {
      name
      id
      loggedIn
    }
  }
`;
