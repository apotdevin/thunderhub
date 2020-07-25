import gql from 'graphql-tag';

export const CREATE_INVOICE = gql`
  mutation CreateInvoice($amount: Int!) {
    createInvoice(amount: $amount) {
      request
    }
  }
`;
