import gql from 'graphql-tag';

export const RECOVER_FUNDS = gql`
  query RecoverFunds($backup: String!) {
    recoverFunds(backup: $backup)
  }
`;
