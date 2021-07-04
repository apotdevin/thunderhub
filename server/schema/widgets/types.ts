import { gql } from 'apollo-server-micro';

export const widgetTypes = gql`
  type channelReportType {
    local: Int
    remote: Int
    maxIn: Int
    maxOut: Int
    commit: Int
    totalPendingHtlc: Int
    outgoingPendingHtlc: Int
    incomingPendingHtlc: Int
  }
`;
