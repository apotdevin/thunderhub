import { gql } from '@apollo/client';

export const GET_TRADE_READINESS = gql`
  query GetTradeReadiness {
    rails {
      id
      trade_readiness {
        node_online
        public_key
        alias
        has_tapd
        onchain_balance_sats
        pending_onchain_balance_sats
        deposit_address
        has_channel
        has_active_channel
        recommended_node {
          pubkey
          sockets
        }
      }
    }
  }
`;
