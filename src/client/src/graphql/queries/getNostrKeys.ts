import { gql } from '@apollo/client';

export const GET_NOSTR_KEYS = gql`
  query NostrKeys {
    getNostrKeys {
      pubkey
      privkey
    }
  }
`;
