import gql from 'graphql-tag';

export const CREATE_MACAROON = gql`
  mutation CreateMacaroon($permissions: permissionsType!) {
    createMacaroon(permissions: $permissions)
  }
`;
