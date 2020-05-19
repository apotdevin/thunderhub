import gql from 'graphql-tag';

export const GET_BACKUPS = gql`
  query GetBackups($auth: authType!) {
    getBackups(auth: $auth)
  }
`;
