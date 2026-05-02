import { gql } from '@apollo/client';

export const UPSERT_CHANNEL_NOTE = gql`
  mutation UpsertChannelNote($channelId: String!, $note: String!) {
    user {
      offchain {
        channels {
          upsert_note(channelId: $channelId, note: $note) {
            channel_id
            note
            updated_at
          }
        }
      }
    }
  }
`;

export const DELETE_CHANNEL_NOTE = gql`
  mutation DeleteChannelNote($channelId: String!) {
    user {
      offchain {
        channels {
          delete_note(channelId: $channelId)
        }
      }
    }
  }
`;
