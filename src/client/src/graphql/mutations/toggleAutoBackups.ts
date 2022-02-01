import { gql } from '@apollo/client';

export const TOGGLE_AUTO_BACKUPS = gql`
  mutation ToggleAutoBackups {
    toggleAutoBackups
  }
`;
