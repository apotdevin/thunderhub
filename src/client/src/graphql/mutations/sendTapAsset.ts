import { gql } from '@apollo/client';

export const SEND_TAP_ASSET = gql`
  mutation SendTapAsset($tapAddrs: [String!]!) {
    sendTapAsset(tapAddrs: $tapAddrs)
  }
`;
