import * as React from 'react';
import { useChatState, useChatDispatch } from '../../context/ChatContext';
import { useGetMessagesQuery } from '../../generated/graphql';
import { useAccount } from '../../context/AccountContext';
import { toast } from 'react-toastify';
import { getErrorContent } from '../../utils/error';
import { useRouter } from 'next/router';

export const ChatFetcher = () => {
  const newChatToastId = 'newChatToastId';

  const { auth } = useAccount();
  const { pathname } = useRouter();
  const { initialized, lastChat } = useChatState();
  const dispatch = useChatDispatch();

  const { data, loading, error } = useGetMessagesQuery({
    skip: !auth || !initialized,
    pollInterval: 1000,
    fetchPolicy: 'network-only',
    variables: { auth, initialize: false },
    onError: error => toast.error(getErrorContent(error)),
  });

  React.useEffect(() => {
    if (data?.getMessages?.messages) {
      const messages = [...data.getMessages.messages];
      let index = -1;

      for (let i = 0; i < messages.length; i += 1) {
        if (index < 0) {
          const element = messages[i];
          const { id } = element;

          if (id === lastChat) {
            index = i;
          }
        }
      }

      let newMessages = [];
      if (index < 1) {
        return;
      }

      if (pathname !== '/chat') {
        if (!toast.isActive(newChatToastId)) {
          toast.success('You have a new message', { position: 'bottom-right' });
        }
      }

      newMessages = messages.slice(0, index);
      const last = newMessages[0].id;
      // console.log('New messages', { newMessages });
      dispatch({ type: 'additional', chats: newMessages, lastChat: last });
    }
  }, [data, loading, error]);

  return null;
};
