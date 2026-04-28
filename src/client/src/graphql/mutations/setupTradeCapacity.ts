import { gql } from '@apollo/client';

export const SETUP_TRADE_CAPACITY = gql`
  mutation SetupTradeCapacity($input: SetupTradeCapacityInput!) {
    setupTradeCapacity(input: $input) {
      success
      magmaOrderId
      magmaOrderStatus
      magmaOrderAmountSats
      magmaOrderAmountAsset
      magmaOrderFeeSats
      outboundChannelTxid
      outboundChannelOutputIndex
      skippedMagmaOrder
      skippedOutboundChannel
    }
  }
`;
