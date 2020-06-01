import { gql } from 'apollo-server-micro';

export const chatTypes = gql`
  type getMessagesType {
    token: String
    messages: [messagesType]
  }

  type messagesType {
    date: String
    id: String
    verified: Boolean
    contentType: String
    sender: String
    alias: String
    message: String
    tokens: Int
  }
`;
