import { gql } from '@apollo/client';

export const GET_TAP_FEDERATION_SERVERS = gql`
  query GetTapFederationServers {
    getTapFederationServers {
      nodeAddress
      servers {
        host
        id
      }
    }
  }
`;
