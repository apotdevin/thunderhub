import { FC, useEffect } from 'react';
import toast from 'react-hot-toast';
import { useLocation } from 'react-router-dom';
import { useGetMessagesQuery } from '../../../src/graphql/queries/__generated__/getMessages.generated';
import { useAccount } from '../../../src/hooks/UseAccount';
import { useChatState, useChatDispatch } from '../../context/ChatContext';
import { getErrorContent } from '../../utils/error';
import { useConfigState } from '../../context/ConfigContext';

export const ChatFetcher: FC = () => {
  const newChatToastId = 'newChatToastId';

  const { chatPollingSpeed } = useConfigState();

  const account = useAccount();
  const { pathname } = useLocation();
  const { lastChat, chats, sentChats, initialized } = useChatState();
  const dispatch = useChatDispatch();

  const noChatsAvailable = chats.length <= 0 && sentChats.length <= 0;

  const { data, loading, error } = useGetMessagesQuery({
    ssr: false,
    skip: initialized || noChatsAvailable || !account,
    pollInterval: chatPollingSpeed,
    fetchPolicy: 'network-only',
    variables: { initialize: !noChatsAvailable },
    onError: error => toast.error(getErrorContent(error)),
  });

  useEffect(() => {
    if (data && data.getMessages?.messages) {
      const messages = [...data.getMessages.messages];
      let index = -1;

      if (lastChat !== '') {
        for (let i = 0; i < messages.length; i += 1) {
          if (index < 0) {
            const element = messages[i];
            if (element?.id === lastChat) {
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

      if (newMessages?.length) {
        const last = newMessages[0]?.id || '';
        dispatch({
          type: 'additional',
          chats: newMessages || [],
          lastChat: last,
        });
      }
    }
  }, [data, loading, error, dispatch, lastChat, pathname]);

  return null;
};
