import { gql } from '@apollo/client';

export const GET_TAP_TRANSFERS = gql`
  query GetTapTransfers {
    taproot_assets {
      id
      get_transfers {
        transfers {
          anchor_tx_hash
          anchor_tx_height_hint
          anchor_tx_chain_fees
          transfer_timestamp
          label
          inputs {
            anchor_point
            asset_id
            amount
            precision
          }
          outputs {
            asset_id
            amount
            script_key_is_local
            output_type
            precision
          }
        }
      }
    }
  }
`;
