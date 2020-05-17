import gql from 'graphql-tag';

export const GET_IN_OUT = gql`
  query GetInOut($auth: authType!, $time: String) {
    getInOut(auth: $auth, time: $time) {
      invoices
      payments
      confirmedInvoices
      unConfirmedInvoices
    }
  }
`;
