import { gql } from '@apollo/client';

export const LOGOUT = gql`
  mutation Logout {
    logout
  }
`;
