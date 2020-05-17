import gql from 'graphql-tag';

export const RECOVER_FUNDS = gql`
  query RecoverFunds($auth: authType!, $backup: String!) {
    recoverFunds(auth: $auth, backup: $backup)
  }
`;
