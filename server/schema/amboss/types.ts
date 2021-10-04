import { gql } from 'apollo-server-micro';

export const ambossTypes = gql`
  type AmbossSubscriptionType {
    end_date: String!
    subscribed: Boolean!
    upgradable: Boolean!
  }

  type AmbossUserType {
    subscription: AmbossSubscriptionType
  }

  type BosScore {
    position: Float!
    score: Float!
    updated: String!
    alias: String!
    public_key: String!
  }

  type BosScoreInfo {
    count: Float!
    first: BosScore
    last: BosScore
  }

  type NodeBosHistory {
    info: BosScoreInfo!
    scores: [BosScore!]!
  }

  type LightningAddress {
    pubkey: String!
    lightning_address: String!
  }

  type NodeSocialInfo {
    private: Boolean
    telegram: String
    twitter: String
    twitter_verified: Boolean
    website: String
    email: String
  }

  type NodeSocial {
    info: NodeSocialInfo
  }

  type LightningNodeSocialInfo {
    socials: NodeSocial
  }
`;
