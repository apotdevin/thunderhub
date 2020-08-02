import { gql } from '@apollo/client';

export const GET_FORWARD_CHANNELS_REPORT = gql`
  query GetForwardChannelsReport($time: String, $order: String, $type: String) {
    getForwardChannelsReport(time: $time, order: $order, type: $type)
  }
`;
