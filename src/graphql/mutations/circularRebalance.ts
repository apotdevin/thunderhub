import gql from 'graphql-tag';

export const CIRCULAR_REBALANCE = gql`
  mutation CircularRebalance($route: String!) {
    circularRebalance(route: $route)
  }
`;
