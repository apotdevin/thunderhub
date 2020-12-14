import { gql } from '@apollo/client';

export const CREATE_BASE_TOKEN_INVOICE = gql`
  mutation CreateBaseTokenInvoice {
    createBaseTokenInvoice {
      request
      id
    }
  }
`;
