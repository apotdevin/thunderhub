import { gql } from '@apollo/client';

export const CREATE_INVOICE = gql`
  mutation CreateInvoice(
    $amount: Float!
    $description: String
    $secondsUntil: Float
    $includePrivate: Boolean
  ) {
    createInvoice(
      amount: $amount
      description: $description
      secondsUntil: $secondsUntil
      includePrivate: $includePrivate
    ) {
      request
      id
    }
  }
`;
