import gql from 'graphql-tag';

export const GET_IN_OUT = gql`
  query GetInOut($time: String) {
    getInOut(time: $time) {
      invoices
      payments
      confirmedInvoices
      unConfirmedInvoices
    }
  }
`;
