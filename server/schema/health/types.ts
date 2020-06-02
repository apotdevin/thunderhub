import { gql } from 'apollo-server-micro';

export const healthTypes = gql`
  type channelHealth {
    id: String
    score: Int
    partner: Node
  }

  type channelsHealth {
    score: Int
    channels: [channelHealth]
  }

  type channelFeeHealth {
    id: String
    myScore: Int
    partnerScore: Int
    partner: Node
  }

  type channelsFeeHealth {
    score: Int
    channels: [channelFeeHealth]
  }
`;
