import { gql } from '@apollo/client';

export const TOGGLE_CONFIG = gql`
  mutation ToggleConfig($field: ConfigFields!) {
    toggleConfig(field: $field)
  }
`;
