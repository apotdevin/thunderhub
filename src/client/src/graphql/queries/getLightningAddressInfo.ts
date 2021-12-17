import { gql } from '@apollo/client';

export const GET_LIGHTNING_ADDRESS_INFO = gql`
  query GetLightningAddressInfo($address: String!) {
    getLightningAddressInfo(address: $address) {
      callback
      maxSendable
      minSendable
      metadata
      commentAllowed
      tag
    }
  }
`;
