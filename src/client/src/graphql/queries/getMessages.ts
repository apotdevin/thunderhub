import { gql } from '@apollo/client';

export const GET_MESSAGES = gql`
  query GetMessages($initialize: Boolean) {
    getMessages(initialize: $initialize) {
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
