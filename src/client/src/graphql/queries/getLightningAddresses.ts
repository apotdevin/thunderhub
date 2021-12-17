import { gql } from '@apollo/client';

export const GET_LIGHTNING_ADDRESSES = gql`
  query GetLightningAddresses {
    getLightningAddresses {
      pubkey
      lightning_address
    }
  }
`;
