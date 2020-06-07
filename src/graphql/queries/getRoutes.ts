import gql from 'graphql-tag';

export const GET_ROUTES = gql`
  query GetRoutes(
    $auth: authType!
    $outgoing: String!
    $incoming: String!
    $tokens: Int!
    $maxFee: Int
  ) {
    getRoutes(
      auth: $auth
      outgoing: $outgoing
      incoming: $incoming
      tokens: $tokens
      maxFee: $maxFee
    ) {
      confidence
      fee
      fee_mtokens
      hops {
        channel
        channel_capacity
        fee
        fee_mtokens
        forward
        forward_mtokens
        public_key
        timeout
      }
      mtokens
      safe_fee
      safe_tokens
      timeout
      tokens
    }
  }
`;
