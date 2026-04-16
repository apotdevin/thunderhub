import { gql } from '@apollo/client';

export const FUND_TAP_ASSET_CHANNEL = gql`
  mutation FundTapAssetChannel($input: TapFundChannelInput!) {
    taproot_assets {
      fund_asset_channel(input: $input) {
        txid
        output_index
      }
    }
  }
`;
