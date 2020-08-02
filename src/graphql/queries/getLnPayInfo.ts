import { gql } from '@apollo/client';

export const GET_LN_PAY_INFO = gql`
  query GetLnPayInfo {
    getLnPayInfo {
      max
      min
    }
  }
`;
