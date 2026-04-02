import { gql } from '@apollo/client';

export const GET_SESSION_TOKEN = gql`
  mutation GetSessionToken($id: String!, $password: String!, $token: String) {
    public {
      get_session_token(id: $id, password: $password, token: $token)
    }
  }
`;
