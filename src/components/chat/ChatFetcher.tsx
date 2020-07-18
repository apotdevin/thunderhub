import * as React from 'react';
import { toast } from 'react-toastify';
import { useRouter } from 'next/router';
import { useAccountState } from 'src/context/AccountContext';
import { useGetMessagesQuery } from 'src/graphql/queries/__generated__/getMessages.generated';
import { useStatusState } from 'src/context/StatusContext';
import { useChatState, useChatDispatch } from '../../context/ChatContext';
import { getErrorContent } from '../../utils/error';
import { useConfigState } from '../../context/ConfigContext';

export const ChatFetcher: React.FC = () => {
  const newChatToastId = 'newChatToastId';

  const { chatPollingSpeed } = useConfigState();

  const { connected } = useStatusState();
  const { auth } = useAccountState();
  const { pathname } = useRouter();
  const { lastChat, chats, sentChats, initialized } = useChatState();
  const dispatch = useChatDispatch();

  const noChatsAvailable = chats.length <= 0 && sentChats.length <= 0;

  const { data, loading, error } = useGetMessagesQuery({
    ssr: false,
    skip: !auth || initialized || noChatsAvailable || !connected,
    pollInterval: chatPollingSpeed,
    fetchPolicy: 'network-only',
    variables: { auth, initialize: !noChatsAvailable },
    onError: error => toast.error(getErrorContent(error)),
  });

  React.useEffect(() => {
    if (data && data.getMessages?.messages) {
      const messages = [...data.getMessages.messages];
      let index = -1;

      if (lastChat !== '') {
        for (let i = 0; i < messages.length; i += 1) {
          if (index < 0) {
            const element = messages[i];
            const { id } = element;

            if (id === lastChat) {
              index = i;
            }
          }
        }
      } else {
        index = 100;
      }

      if (index < 1) {
        return;
      }

      if (pathname !== '/chat') {
        if (!toast.isActive(newChatToastId)) {
          toast.success('You have a new message', { position: 'bottom-right' });
        }
      }

      const newMessages = messages.slice(0, index);
      const last = newMessages[0]?.id;
      dispatch({ type: 'additional', chats: newMessages, lastChat: last });
    }
  }, [data, loading, error, dispatch, lastChat, pathname]);

  return null;
};
