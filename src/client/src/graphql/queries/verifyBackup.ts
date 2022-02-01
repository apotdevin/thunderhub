import { gql } from '@apollo/client';

export const VERIFY_BACKUP = gql`
  query VerifyBackup($backup: String!) {
    verifyBackup(backup: $backup)
  }
`;
