import { gql } from '@apollo/client';

export const GET_BASE_POINTS = gql`
  query GetBasePoints {
    getBasePoints {
      alias
      amount
    }
  }
`;
