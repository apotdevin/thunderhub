import gql from 'graphql-tag';

export const LOGOUT = gql`
  mutation Logout($type: String!) {
    logout(type: $type)
  }
`;
