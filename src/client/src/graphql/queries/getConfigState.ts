import { gql } from '@apollo/client';

export const GET_CONFIG_STATE = gql`
  query GetConfigState {
    getConfigState {
      backup_state
      healthcheck_ping_state
      onchain_push_enabled
      channels_push_enabled
      private_channels_push_enabled
    }
  }
`;
