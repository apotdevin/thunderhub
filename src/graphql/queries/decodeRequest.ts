import gql from 'graphql-tag';

export const DECODE_REQUEST = gql`
  query DecodeRequest($request: String!) {
    decodeRequest(request: $request) {
      chain_address
      cltv_delta
      description
      description_hash
      destination
      destination_node {
        node {
          alias
        }
      }
      expires_at
      id
      routes {
        base_fee_mtokens
        channel
        cltv_delta
        fee_rate
        public_key
      }
      tokens
      probe_route {
        route {
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
            node {
              node {
                alias
              }
            }
          }
          mtokens
          safe_fee
          safe_tokens
          timeout
          tokens
        }
      }
    }
  }
`;
