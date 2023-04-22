import { gql } from '@apollo/client';

export const PUBLISH_NOSTR_PROFILE = gql`
  mutation PublishNostrProfile($privateKey: String!) {
    publishNostrProfile(privateKey: $privateKey) {
      profile {
        kind
        tags
        content
        created_at
        pubkey
        id
        sig
      }
      announcement {
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
