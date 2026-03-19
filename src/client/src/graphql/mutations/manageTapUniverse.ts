import { gql } from '@apollo/client';

export const ADD_TAP_FEDERATION_SERVER = gql`
  mutation AddTapFederationServer($host: String!) {
    addTapFederationServer(host: $host)
  }
`;

export const REMOVE_TAP_FEDERATION_SERVER = gql`
  mutation RemoveTapFederationServer($host: String!) {
    removeTapFederationServer(host: $host)
  }
`;

export const SYNC_TAP_UNIVERSE = gql`
  mutation SyncTapUniverse($host: String!) {
    syncTapUniverse(host: $host) {
      syncedUniverses
    }
  }
`;
