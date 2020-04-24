import groupBy from 'lodash.groupby';

export const separateBySender = (chats: any[]) => {
  return groupBy(chats, 'sender');
};

export const getSenders = (bySender: {}) => {
  const senders: { key: string; alias: string }[] = [];
  for (const key in bySender) {
    if (bySender.hasOwnProperty(key)) {
      const element = bySender[key];
      if (element.length > 0) {
        const chat = element[0];
        const { sender, alias } = chat;
        // const name =
        //   alias && alias !== '' ? alias : sender && sender.substring(0, 6);

        if (sender) {
          senders.push({ key: sender, alias });
        }
      }
    }
  }
  return senders;
};
