import gql from 'graphql-tag';

export const GET_FORWARD_CHANNELS_REPORT = gql`
  query GetForwardChannelsReport(
    $time: String
    $order: String
    $type: String
    $auth: authType!
  ) {
    getForwardChannelsReport(
      time: $time
      order: $order
      auth: $auth
      type: $type
    )
  }
`;
