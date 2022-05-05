import { gql } from '@apollo/client';

export const PUSH_BACKUP = gql`
  mutation PushBackup {
    pushBackup
  }
`;
