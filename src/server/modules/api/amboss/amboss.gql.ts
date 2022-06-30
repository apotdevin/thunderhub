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
        available_size
        last_update
        last_update_size
        remaining_size
        total_size_saved
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
