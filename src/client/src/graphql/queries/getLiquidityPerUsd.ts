import { gql } from '@apollo/client';

export const GetLiquidityPerUsd = gql`
  query GetLiquidityPerUsd {
    getLiquidityPerUsd
  }
`;
