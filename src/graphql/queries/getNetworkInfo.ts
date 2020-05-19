import gql from 'graphql-tag';

export const GET_NETWORK_INFO = gql`
  query GetNetworkInfo($auth: authType!) {
    getNetworkInfo(auth: $auth) {
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
