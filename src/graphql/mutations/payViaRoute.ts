import gql from 'graphql-tag';

export const PAY_VIA_ROUTE = gql`
  mutation PayViaRoute($auth: authType!, $route: String!, $id: String!) {
    payViaRoute(auth: $auth, route: $route, id: $id)
  }
`;
