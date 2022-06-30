import { gql } from '@apollo/client';

export const TOGGLE_HEALTH_PINGS = gql`
  mutation ToggleHealthPings {
    toggleHealthPings
  }
`;
