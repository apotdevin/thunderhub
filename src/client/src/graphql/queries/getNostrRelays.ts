import { gql } from '@apollo/client';

export const GET_NOSTR_RELAYS = gql`
  query NostrRelays {
    getNostrRelays {
      urls
    }
  }
`;
