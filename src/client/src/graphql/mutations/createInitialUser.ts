import { gql } from '@apollo/client';

export const CREATE_INITIAL_USER = gql`
  mutation CreateInitialUser($email: String!, $password: String!) {
    public {
      create_initial_user(email: $email, password: $password) {
        id
        email
        role
      }
    }
  }
`;
