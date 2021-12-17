import { gql } from '@apollo/client';

export const VERIFY_BACKUPS = gql`
  query VerifyBackups($backup: String!) {
    verifyBackups(backup: $backup)
  }
`;
