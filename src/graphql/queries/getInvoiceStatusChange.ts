import { gql } from '@apollo/client';

export const GET_INVOICE_STATUS_CHANGE = gql`
  query GetInvoiceStatusChange($id: String!) {
    getInvoiceStatusChange(id: $id)
  }
`;
