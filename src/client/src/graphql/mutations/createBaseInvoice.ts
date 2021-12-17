import { gql } from '@apollo/client';

export const CREATE_BASE_INVOICE = gql`
  mutation CreateBaseInvoice($amount: Float!) {
    createBaseInvoice(amount: $amount) {
      request
      id
    }
  }
`;
