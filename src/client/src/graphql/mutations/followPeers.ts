import { gql } from '@apollo/client';

export const FOLLOW_PEERS = gql`
  mutation FollowPeers($privateKey: String!) {
    followPeers(privateKey: $privateKey) {
      peers {
        kind
        id
        tags
        content
        created_at
        pubkey
        sig
      }
    }
  }
`;
