import { gql } from '@apollo/client';

export const GET_TAP_INFO = gql`
  query GetTapInfo {
    taproot_assets {
      id
      get_info {
        version
        lnd_version
        network
        lnd_identity_pubkey
        node_alias
        block_height
        block_hash
        sync_to_chain
      }
    }
  }
`;
