import gql from 'graphql-tag';

export const GET_AUTH_TOKEN = gql`
  query GetAuthToken($cookie: String) {
    getAuthToken(cookie: $cookie)
  }
`;
