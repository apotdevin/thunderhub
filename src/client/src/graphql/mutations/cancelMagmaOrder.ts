import { gql } from '@apollo/client';

export const CANCEL_MAGMA_ORDER = gql`
  mutation CancelMagmaOrder($input: CancelMagmaOrderInput!) {
    cancelMagmaOrder(input: $input) {
      success
    }
  }
`;
