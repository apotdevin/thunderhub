import { gql } from '@apollo/client';

export const GET_SESSION_TOKEN = gql`
  query GetSessionToken($id: String!, $password: String!) {
    getSessionToken(id: $id, password: $password)
  }
`;
