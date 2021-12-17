import { gql } from '@apollo/client';

export const GET_NODE_SOCIAL_INFO = gql`
  query GetNodeSocialInfo($pubkey: String!) {
    getNodeSocialInfo(pubkey: $pubkey) {
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
