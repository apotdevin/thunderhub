import { gql } from '@apollo/client';

export const CHANNEL_FEES = gql`
  query ChannelFees {
    getChannels {
      id
      partner_public_key
      partner_node_info {
        node {
          alias
          color
        }
      }
      partner_fee_info {
        channel {
          transaction_id
          transaction_vout
          node_policies {
            base_fee_mtokens
            fee_rate
            cltv_delta
            max_htlc_mtokens
            min_htlc_mtokens
          }
          partner_node_policies {
            base_fee_mtokens
            fee_rate
            cltv_delta
            max_htlc_mtokens
            min_htlc_mtokens
          }
        }
      }
    }
  }
`;
