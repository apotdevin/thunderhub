import { gql } from '@apollo/client';

export const CREATE_INVOICE = gql`
  mutation CreateInvoice(
    $amount: Int!
    $description: String
    $secondsUntil: Int
  ) {
    createInvoice(
      amount: $amount
      description: $description
      secondsUntil: $secondsUntil
    ) {
      request
      id
    }
  }
`;
