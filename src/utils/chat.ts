import { sortBy, groupBy } from 'lodash';
import { MessagesType } from 'src/graphql/types';

export const separateBySender = (chats: MessagesType[]) => {
  return groupBy(chats, 'sender');
};

export const getSenders = (
  bySender: ReturnType<typeof separateBySender>
): MessagesType[] => {
  const senders: MessagesType[] = [];
  for (const key in bySender) {
    if (Object.prototype.hasOwnProperty.call(bySender, key)) {
      const messages = bySender[key];
      const sorted: MessagesType[] = sortBy(messages, 'date').reverse();

      if (sorted.length > 0) {
        const chat = sorted[0];
        if (chat?.sender) {
          senders.push(chat);
        }
      }
    }
  }
  return senders;
};

export const getSubMessage = (
  contentType: string | null,
  message: string | null,
  tokens: number | null,
  isSent: boolean
): string => {
  if (!contentType) return '';
  if (!message && !tokens) return '';
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
      if (message) return message;
      return '';
  }
};
