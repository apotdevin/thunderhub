import { gql } from '@apollo/client';

export const GET_AUTH_TOKEN = gql`
  query GetAuthToken($cookie: String) {
    getAuthToken(cookie: $cookie)
  }
`;
