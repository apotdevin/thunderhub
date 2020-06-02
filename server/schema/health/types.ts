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

  type channelTimeHealth {
    id: String
    score: Int
    monitoredTime: Int
    partner: Node
  }

  type channelsTimeHealth {
    score: Int
    channels: [channelTimeHealth]
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
