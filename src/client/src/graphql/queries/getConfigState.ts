import { gql } from '@apollo/client';

export const GET_CONFIG_STATE = gql`
  query GetConfigState {
    getConfigState {
      backup_state
      healthcheck_ping_state
    }
  }
`;
