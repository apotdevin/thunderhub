import { gql } from '@apollo/client';

export const PAY_VIA_ROUTE = gql`
  mutation PayViaRoute($route: String!, $id: String!) {
    payViaRoute(route: $route, id: $id)
  }
`;
