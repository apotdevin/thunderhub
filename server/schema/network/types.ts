import { gql } from 'apollo-server-micro';

export const networkTypes = gql`
  type networkInfoType {
    averageChannelSize: String
    channelCount: Int
    maxChannelSize: Int
    medianChannelSize: Int
    minChannelSize: Int
    nodeCount: Int
    notRecentlyUpdatedPolicyCount: Int
    totalCapacity: String
  }
`;
