import { gql } from '@apollo/client';

export const CREATE_MACAROON = gql`
  mutation CreateMacaroon($permissions: NetworkInfoInput!) {
    createMacaroon(permissions: $permissions) {
      base
      hex
    }
  }
`;
