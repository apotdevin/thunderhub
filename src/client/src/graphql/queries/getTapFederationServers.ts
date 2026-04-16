import { gql } from '@apollo/client';

export const GET_TAP_FEDERATION_SERVERS = gql`
  query GetTapFederationServers {
    taproot_assets {
      get_federation_servers {
        node_address
        servers {
          host
          id
        }
      }
    }
  }
`;
