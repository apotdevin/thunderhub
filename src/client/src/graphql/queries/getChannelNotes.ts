import { gql } from '@apollo/client';

export const GET_CHANNEL_NOTES = gql`
  query GetChannelNotes {
    getChannelNotes {
      channelId
      note
      updatedAt
    }
  }
`;
