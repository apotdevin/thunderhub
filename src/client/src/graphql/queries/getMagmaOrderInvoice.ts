import { gql } from '@apollo/client';

export const GET_MAGMA_ORDER_INVOICE = gql`
  query GetMagmaOrderInvoice($orderId: String!) {
    magma {
      id
      orders {
        get_invoice(orderId: $orderId) {
          invoice
        }
      }
    }
  }
`;
