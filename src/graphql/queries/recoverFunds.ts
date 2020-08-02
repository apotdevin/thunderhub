import { gql } from '@apollo/client';

export const RECOVER_FUNDS = gql`
  query RecoverFunds($backup: String!) {
    recoverFunds(backup: $backup)
  }
`;
