import gql from 'graphql-tag';

export const GET_BACKUPS = gql`
  query GetBackups {
    getBackups
  }
`;
