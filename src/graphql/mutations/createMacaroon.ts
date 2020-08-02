import { gql } from '@apollo/client';

export const CREATE_MACAROON = gql`
  mutation CreateMacaroon($permissions: permissionsType!) {
    createMacaroon(permissions: $permissions)
  }
`;
