import { gql } from '@apollo/client';

export const UPDATE_MULTIPLE_FEES = gql`
  mutation UpdateMultipleFees($channels: [UpdateRoutingFeesParams!]!) {
    updateMultipleFees(channels: $channels)
  }
`;
