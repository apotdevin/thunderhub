import { gql } from '@apollo/client';

export const GET_PENDING_MAGMA_ORDERS = gql`
  query GetPendingMagmaOrders {
    getPendingMagmaOrders {
      purchases {
        id
        createdAt
        status
        paymentStatus
        source {
          pubkey
          alias
        }
        destination {
          pubkey
          alias
        }
        amount {
          sats
        }
        fees {
          seller {
            sats
          }
          buyer {
            sats
          }
        }
        timeout
        channelId
      }
      sales {
        id
        createdAt
        status
        paymentStatus
        source {
          pubkey
          alias
        }
        destination {
          pubkey
          alias
        }
        amount {
          sats
        }
        fees {
          seller {
            sats
          }
          buyer {
            sats
          }
        }
        timeout
        channelId
      }
    }
  }
`;
