import { gql } from '@apollo/client';

export const CANCEL_MAGMA_ORDER = gql`
  mutation CancelMagmaOrder($input: CancelMagmaOrderInput!) {
    magma {
      cancel_order(input: $input) {
        success
      }
    }
  }
`;
