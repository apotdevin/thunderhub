import gql from 'graphql-tag';

export const GET_CAN_CONNECT = gql`
  query GetCanConnect($auth: authType!) {
    getNodeInfo(auth: $auth) {
      chains
      color
      active_channels_count
      closed_channels_count
      alias
      is_synced_to_chain
      peers_count
      pending_channels_count
      version
    }
  }
`;

export const GET_NODE_INFO = gql`
  query GetNodeInfo($auth: authType!) {
    getNodeInfo(auth: $auth) {
      chains
      color
      active_channels_count
      closed_channels_count
      alias
      is_synced_to_chain
      peers_count
      pending_channels_count
      version
    }
    getChainBalance(auth: $auth)
    getPendingChainBalance(auth: $auth)
    getChannelBalance(auth: $auth) {
      confirmedBalance
      pendingBalance
    }
  }
`;

export const GET_CHANNEL_AMOUNT_INFO = gql`
  query GetChannelAmountInfo($auth: authType!) {
    getNodeInfo(auth: $auth) {
      active_channels_count
      closed_channels_count
      pending_channels_count
    }
  }
`;

export const GET_CONNECT_INFO = gql`
  query GetCanConnectInfo($auth: authType!) {
    getNodeInfo(auth: $auth) {
      public_key
      uris
    }
  }
`;
