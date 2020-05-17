import gql from 'graphql-tag';

export const CREATE_INVOICE = gql`
  mutation CreateInvoice($amount: Int!, $auth: authType!) {
    createInvoice(amount: $amount, auth: $auth) {
      request
    }
  }
`;
