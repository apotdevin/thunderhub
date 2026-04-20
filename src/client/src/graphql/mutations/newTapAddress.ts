import { gql } from '@apollo/client';

export const NEW_TAP_ADDRESS = gql`
  mutation NewTapAddress(
    $asset_id: String
    $group_key: String
    $amt: String!
    $proof_courier_addr: String
  ) {
    taproot_assets {
      new_address(
        asset_id: $asset_id
        group_key: $group_key
        amt: $amt
        proof_courier_addr: $proof_courier_addr
      ) {
        encoded
        asset_id
        amount
        script_key
        internal_key
        taproot_output_key
      }
    }
  }
`;
