import { gql } from 'apollo-server-micro';

export const healthTypes = gql`
  type channelHealth {
    id: String
    score: Int
    volumeNormalized: String
    averageVolumeNormalized: String
    partner: Node
  }

  type channelsHealth {
    score: Int
    channels: [channelHealth]
  }

  type channelTimeHealth {
    id: String
    score: Int
    significant: Boolean
    monitoredTime: Int
    monitoredUptime: Int
    monitoredDowntime: Int
    partner: Node
  }

  type channelsTimeHealth {
    score: Int
    channels: [channelTimeHealth]
  }

  type feeHealth {
    score: Int
    rate: Int
    base: String
    rateScore: Int
    baseScore: Int
    rateOver: Boolean
    baseOver: Boolean
  }

  type channelFeeHealth {
    id: String
    partnerSide: feeHealth
    mySide: feeHealth
    partner: Node
  }

  type channelsFeeHealth {
    score: Int
    channels: [channelFeeHealth]
  }
`;
