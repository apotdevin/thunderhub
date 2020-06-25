import gql from 'graphql-tag';

export const GET_ACCOUNTING_REPORT = gql`
  query GetAccountingReport(
    $auth: authType!
    $category: String
    $currency: String
    $fiat: String
    $month: String
    $year: String
  ) {
    getAccountingReport(
      auth: $auth
      category: $category
      currency: $currency
      fiat: $fiat
      month: $month
      year: $year
    )
  }
`;
