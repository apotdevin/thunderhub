import { gql } from '@apollo/client';

export const ADD_TAP_FEDERATION_SERVER = gql`
  mutation AddTapFederationServer($host: String!) {
    taproot_assets {
      add_federation_server(host: $host)
    }
  }
`;

export const REMOVE_TAP_FEDERATION_SERVER = gql`
  mutation RemoveTapFederationServer($host: String!) {
    taproot_assets {
      remove_federation_server(host: $host)
    }
  }
`;

export const SYNC_TAP_UNIVERSE = gql`
  mutation SyncTapUniverse($host: String!) {
    taproot_assets {
      sync_universe(host: $host) {
        synced_universes
      }
    }
  }
`;
