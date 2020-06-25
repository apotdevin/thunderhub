import gql from 'graphql-tag';

export const GET_ACCOUNTING_REPORT = gql`
  query GetAccountingReport($auth: authType!) {
    getAccountingReport(auth: $auth)
  }
`;
