import gql from 'graphql-tag';

export const CIRCULAR_REBALANCE = gql`
  mutation CircularRebalance($auth: authType!, $route: String!) {
    circularRebalance(auth: $auth, route: $route)
  }
`;
