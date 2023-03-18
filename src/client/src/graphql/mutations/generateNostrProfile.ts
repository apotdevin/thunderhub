import { gql } from '@apollo/client';

export const GENERATE_NOSTR_PROFILE = gql`
  mutation GenerateNostrProfile($privateKey: String!) {
    generateNostrProfile(privateKey: $privateKey) {
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
