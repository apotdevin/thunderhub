import { gql } from '@apollo/client';

export const SETUP_TRADE_PARTNER = gql`
  mutation SetupTradePartner($input: SetupTradePartnerInput!) {
    setupTradePartner(input: $input) {
      success
      magmaOrderId
      magmaOrderStatus
      magmaOrderAmountSats
      magmaOrderAmountAsset
      magmaOrderFeeSats
      outboundChannelTxid
      outboundChannelOutputIndex
    }
  }
`;
