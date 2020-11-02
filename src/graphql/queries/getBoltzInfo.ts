import { gql } from '@apollo/client';

export const GET_BOLTZ_INFO = gql`
  query GetBoltzInfo {
    getBoltzInfo {
      max
      min
      feePercent
    }
  }
`;
