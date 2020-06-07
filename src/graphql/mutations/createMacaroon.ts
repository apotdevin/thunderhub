import gql from 'graphql-tag';

export const CREATE_MACAROON = gql`
  mutation CreateMacaroon($auth: authType!, $permissions: permissionsType!) {
    createMacaroon(auth: $auth, permissions: $permissions)
  }
`;
