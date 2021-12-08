import { gql } from '@apollo/client';

export const GET_NETWORK_INFO = gql`
  query GetNetworkInfo {
    getNetworkInfo {
      averageChannelSize
      channelCount
      maxChannelSize
      medianChannelSize
      minChannelSize
      nodeCount
      notRecentlyUpdatedPolicyCount
      totalCapacity
    }
  }
`;
