import { gql } from '@apollo/client';

export const SET_CHANNEL_NOTE = gql`
  mutation SetChannelNote($channelId: String!, $note: String!) {
    setChannelNote(channelId: $channelId, note: $note) {
      channelId
      note
      updatedAt
    }
  }
`;
