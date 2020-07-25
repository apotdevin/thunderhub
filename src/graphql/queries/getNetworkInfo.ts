import gql from 'graphql-tag';

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
