import { gql } from '@apollo/client';

export const CREATE_BASE_INVOICE = gql`
  mutation CreateBaseInvoice($amount: Int!) {
    createBaseInvoice(amount: $amount) {
      request
      id
    }
  }
`;
