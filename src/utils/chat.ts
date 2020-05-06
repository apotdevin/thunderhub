import groupBy from 'lodash.groupby';
import { MessageType } from '../views/chat/Chat.types';
import { sortBy } from 'underscore';
import { MessagesType } from '../generated/graphql';

export const separateBySender = (chats: any[]) => {
  return groupBy(chats, 'sender');
};

export const getSenders = (bySender: {}): MessagesType[] => {
  const senders: MessagesType[] = [];
  for (const key in bySender) {
    if (Object.prototype.hasOwnProperty.call(bySender, key)) {
      const messages = bySender[key];
      const sorted = sortBy(messages, 'date').reverse();
      const element: MessageType[] = sorted.filter(p => p.verified || p.isSent);

      if (element.length > 0) {
        const chat = element[0];
        const { sender } = chat;

        if (sender) {
          senders.push(chat);
        }
      }
    }
  }
  return senders;
};

export const getSubMessage = (
  contentType: string,
  message: string,
  tokens: number,
  isSent: boolean
) => {
  switch (contentType) {
    case 'payment':
      if (isSent) {
        return `Sent ${tokens} sats`;
      }
      return `Received ${tokens} sats`;
    case 'paymentrequest':
      if (isSent) {
        return `You requested ${tokens} sats`;
      }
      return `Requested ${tokens} sats from you`;
    default:
      return message;
  }
};
