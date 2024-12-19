import { gql } from 'graphql-tag';

export const getUserQuery = gql`
  query GetUser {
    getUser {
      subscription {
        end_date
        subscribed
        upgradable
      }
      backups {
        last_update
        last_update_size
        total_size_saved
        slots
      }
      ghost {
        username
      }
    }
  }
`;

export const getLoginTokenQuery = gql`
  query GetLoginToken($seconds: Float) {
    getLoginToken(seconds: $seconds)
  }
`;

export const getSignInfoQuery = gql`
  query GetSignInfo {
    getSignInfo {
      expiry
      identifier
      message
    }
  }
`;

export const loginMutation = gql`
  mutation Login(
    $identifier: String!
    $signature: String!
    $seconds: Float
    $details: String
    $token: Boolean
  ) {
    login(
      identifier: $identifier
      signature: $signature
      seconds: $seconds
      details: $details
      token: $token
    )
  }
`;

export const getLightningAddresses = gql`
  query GetLightningAddresses {
    getLightningAddresses {
      pubkey
      lightning_address
    }
  }
`;

export const getNodeSocialInfo = gql`
  query GetNodeSocialInfo($pubkey: String!) {
    getNode(pubkey: $pubkey) {
      socials {
        info {
          private
          telegram
          twitter
          twitter_verified
          website
          email
        }
      }
    }
  }
`;

export const saveBackupMutation = gql`
  mutation SaveBackup($backup: String!, $signature: String!) {
    saveBackup(backup: $backup, signature: $signature)
  }
`;

export const pingHealthCheckMutation = gql`
  mutation HealthCheck($signature: String!, $timestamp: String!) {
    healthCheck(signature: $signature, timestamp: $timestamp)
  }
`;

export const pushNodeBalancesMutation = gql`
  mutation PushNodeBalances($input: ChannelBalancePushInput!) {
    pushNodeBalances(input: $input)
  }
`;

export const getNodeAliasBatchQuery = gql`
  query GetNodeAliasBatch($pubkeys: [String!]!) {
    getNodeAliasBatch(pubkeys: $pubkeys) {
      alias
      pub_key
    }
  }
`;

export const getEdgeInfoBatchQuery = gql`
  query GetEdgeInfoBatch($ids: [String!]!) {
    getEdgeInfoBatch(ids: $ids) {
      short_channel_id
      info {
        node1_info {
          node {
            alias
            pub_key
          }
        }
        node1_pub
        node2_info {
          node {
            alias
            pub_key
          }
        }
        node2_pub
      }
    }
  }
`;

export const getGhostPayment = gql`
  query GetGhostPayment($input: GhostPaymentInput!) {
    getGhostPayment(input: $input) {
      preimage
      payment_amount
    }
  }
`;

export const claimGhostAddress = gql`
  mutation claimGhostAddress($address: String) {
    claimGhostAddress(address: $address) {
      username
    }
  }
`;
