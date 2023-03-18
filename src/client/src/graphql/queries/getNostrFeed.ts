import { gql } from '@apollo/client';

export const GET_NOSTR_FEED = gql`
  query NostrFeed($myPubkey: String!) {
    getNostrFeed(myPubkey: $myPubkey) {
      feed {
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
