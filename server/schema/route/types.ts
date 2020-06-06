import { gql } from 'apollo-server-micro';

export const routeTypes = gql`
  type probedRouteHop {
    channel: String!
    channel_capacity: Int!
    fee: Int!
    fee_mtokens: String!
    forward: Int!
    forward_mtokens: String!
    public_key: String!
    timeout: Int!
    node: Node!
  }

  type probedRoute {
    confidence: Int!
    fee: Int!
    fee_mtokens: String!
    hops: [probedRouteHop!]!
    mtokens: String!
    safe_fee: Int!
    safe_tokens: Int!
    timeout: Int!
    tokens: Int!
  }

  type ProbeRoute {
    route: probedRoute
  }
`;
