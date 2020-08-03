import { gql } from '@apollo/client';

export const GET_BACKUPS = gql`
  query GetBackups {
    getBackups
  }
`;
