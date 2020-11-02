import { gql } from '@apollo/client';

export const GET_BOLTZ_SWAP_STATUS = gql`
  query GetBoltzSwapStatus($ids: [String]!) {
    getBoltzSwapStatus(ids: $ids) {
      id
      boltz {
        status
        transaction {
          id
          hex
          eta
        }
      }
    }
  }
`;
