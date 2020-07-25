import gql from 'graphql-tag';

export const VERIFY_BACKUPS = gql`
  query VerifyBackups($backup: String!) {
    verifyBackups(backup: $backup)
  }
`;
