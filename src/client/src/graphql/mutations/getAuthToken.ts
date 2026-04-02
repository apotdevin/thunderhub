import { gql } from '@apollo/client';

export const GET_AUTH_TOKEN = gql`
  mutation GetAuthToken($cookie: String) {
    public {
      get_auth_token(cookie: $cookie)
    }
  }
`;
