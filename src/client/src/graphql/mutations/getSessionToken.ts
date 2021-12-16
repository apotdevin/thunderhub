import { gql } from '@apollo/client';

export const GET_SESSION_TOKEN = gql`
  mutation GetSessionToken($id: String!, $password: String!, $token: String) {
    getSessionToken(id: $id, password: $password, token: $token)
  }
`;
