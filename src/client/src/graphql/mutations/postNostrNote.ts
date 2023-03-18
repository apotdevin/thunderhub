import { gql } from '@apollo/client';

export const POST_NOSTR_NOTE = gql`
  mutation NostrEvent($privateKey: String!, $note: String!) {
    postNostrNote(privateKey: $privateKey, note: $note) {
      kind
      tags
      content
      created_at
      pubkey
      id
      sig
    }
  }
`;
