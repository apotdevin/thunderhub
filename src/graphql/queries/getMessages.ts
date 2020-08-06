import { gql } from '@apollo/client';

export const GET_MESSAGES = gql`
  query GetMessages($initialize: Boolean, $lastMessage: String) {
    getMessages(initialize: $initialize, lastMessage: $lastMessage) {
      token
      messages {
        date
        contentType
        alias
        message
        id
        sender
        verified
        tokens
      }
    }
  }
`;
