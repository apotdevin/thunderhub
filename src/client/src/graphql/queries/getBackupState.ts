import { gql } from '@apollo/client';

export const GET_BACKUP_STATE = gql`
  query GetBackupState {
    getBackupState
  }
`;
