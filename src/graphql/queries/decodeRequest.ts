import gql from 'graphql-tag';

export const DECODE_REQUEST = gql`
  query DecodeRequest($auth: authType!, $request: String!) {
    decodeRequest(auth: $auth, request: $request) {
      chain_address
      cltv_delta
      description
      description_hash
      destination
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
