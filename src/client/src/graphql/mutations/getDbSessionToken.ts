import { gql } from '@apollo/client';

export const GET_DB_SESSION_TOKEN = gql`
  mutation GetDbSessionToken($email: String!, $password: String!) {
    public {
      get_db_session_token(email: $email, password: $password)
    }
  }
`;
