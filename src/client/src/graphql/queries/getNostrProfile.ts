import { gql } from '@apollo/client';

export const getNostrProfile = gql`
  query NostrProfile($pubkey: String!) {
    getNostrProfile(pubkey: $pubkey) {
      profile {
        kind
        tags
        content
        created_at
        pubkey
        id
        sig
      }
      attestation {
        kind
        tags
        content
        created_at
        pubkey
        id
        sig
      }
    }
  }
`;
