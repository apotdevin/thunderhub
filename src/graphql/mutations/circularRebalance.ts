import { gql } from '@apollo/client';

export const CIRCULAR_REBALANCE = gql`
  mutation CircularRebalance($route: String!) {
    circularRebalance(route: $route)
  }
`;
