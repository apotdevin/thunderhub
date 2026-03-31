import { gql } from '@apollo/client';

export const FUND_TAP_ASSET_CHANNEL = gql`
  mutation FundTapAssetChannel($input: TapFundChannelInput!) {
    fundTapAssetChannel(input: $input) {
      txid
      outputIndex
    }
  }
`;
