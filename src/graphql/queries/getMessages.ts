import gql from 'graphql-tag';

export const GET_MESSAGES = gql`
  query GetMessages(
    $auth: authType!
    $initialize: Boolean
    $lastMessage: String
  ) {
    getMessages(
      auth: $auth
      initialize: $initialize
      lastMessage: $lastMessage
    ) {
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
