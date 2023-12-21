import { gql } from '@apollo/client';

export const CLAIM_GHOST_ADDRESS = gql`
  mutation ClaimGhostAddress($address: String) {
    claimGhostAddress(address: $address) {
      username
    }
  }
`;
