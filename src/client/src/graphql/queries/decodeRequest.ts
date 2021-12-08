import { gql } from '@apollo/client';

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
    }
  }
`;
