import { gql } from '@apollo/client';

export const UPDATE_MULTIPLE_FEES = gql`
  mutation UpdateMultipleFees($channels: [channelDetailInput!]!) {
    updateMultipleFees(channels: $channels)
  }
`;
