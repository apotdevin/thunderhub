import { gql } from '@apollo/client';

export const BAKE_SUPER_MACAROON = gql`
  mutation BakeSuperMacaroon($input: BakeSuperMacaroonInput!) {
    bakeSuperMacaroon(input: $input) {
      base
      hex
    }
  }
`;
