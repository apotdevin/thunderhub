import gql from 'graphql-tag';

export const getOffersQuery = gql`
  query GetOffers($input: OfferInput!) {
    public {
      offers(input: $input) {
        list {
          id
          magma_offer_id
          node {
            alias
            pubkey
            sockets
          }
          rate {
            display_amount
            full_amount
          }
          available {
            display_amount
            full_amount
          }
        }
        total_count
      }
    }
  }
`;

export const createMagmaOrderMutation = gql`
  mutation CreateManualOrder($input: CreateManualOrderInput!) {
    market {
      order {
        create(input: $input) {
          id
          status
          size
          payment {
            lightning {
              invoice
              pending
            }
          }
          fees {
            buyer {
              sats
            }
          }
        }
      }
    }
  }
`;

export const cancelMagmaOrderMutation = gql`
  mutation CancelOrder($input: CancelOrderInput!) {
    market {
      order {
        cancel(input: $input) {
          success
        }
      }
    }
  }
`;

export const getPendingOrdersQuery = gql`
  query GetPendingOrders($page: PageInput) {
    getUser {
      market {
        orders {
          purchases(input: { action_needed: true }, page: $page) {
            total
            list {
              id
              created_at
              status
              payment_status
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
              channel_id
            }
          }
          sales(input: { action_needed: true }, page: $page) {
            total
            list {
              id
              created_at
              status
              payment_status
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
              channel_id
            }
          }
        }
      }
    }
  }
`;

export const getSupportedAssetsQuery = gql`
  query GetSupportedAssets($input: SupportedAssetsInput) {
    public {
      assets {
        supported(input: $input) {
          list {
            id
            symbol
            description
            precision
            type
            prices {
              id
              usd
            }
            taproot_asset_details {
              asset_id
              group_key
              universe
            }
          }
          total_count
        }
      }
    }
  }
`;
