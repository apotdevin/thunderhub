import gql from 'graphql-tag';

export const GET_ACCOUNT = gql`
  query GetAccount {
    getAccount {
      name
      id
      loggedIn
      type
    }
  }
`;
