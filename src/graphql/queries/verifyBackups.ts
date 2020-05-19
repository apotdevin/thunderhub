import gql from 'graphql-tag';

export const VERIFY_BACKUPS = gql`
  query VerifyBackups($auth: authType!, $backup: String!) {
    verifyBackups(auth: $auth, backup: $backup)
  }
`;
