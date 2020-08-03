import { gql } from '@apollo/client';

export const CREATE_INVOICE = gql`
  mutation CreateInvoice($amount: Int!) {
    createInvoice(amount: $amount) {
      request
    }
  }
`;
