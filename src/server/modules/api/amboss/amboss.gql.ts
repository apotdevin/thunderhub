import { gql } from 'graphql-tag';

export const NodeLoginInfo = gql`
  query NodeLoginInfo {
    login {
      node_login {
        id
        identifier
        message
      }
    }
  }
`;

export const NodeLogin = gql`
  mutation NodeLogin($input: NodeLoginInput!) {
    public {
      node_login(input: $input) {
        jwt
      }
    }
  }
`;

export const CreateApiKey = gql`
  mutation CreateApiKey($input: ApiKeyInput!) {
    api_keys {
      create(input: $input) {
        token
      }
    }
  }
`;

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
      }
    }
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

export const AuthorizeDomain = gql`
  mutation AuthorizeDomain($input: AuthorizeInput!) {
    auth {
      authorize_domain(input: $input) {
        token_url
        has_access
      }
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
