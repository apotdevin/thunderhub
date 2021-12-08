import * as React from 'react';
import { toast } from 'react-toastify';
import { useGetMessagesLazyQuery } from '../../../src/graphql/queries/__generated__/getMessages.generated';
import { MessagesType } from '../../../src/graphql/types';
import { useAccount } from '../../../src/hooks/UseAccount';
import { useChatDispatch } from '../../context/ChatContext';
import { getErrorContent } from '../../utils/error';

export const ChatInit: React.FC = () => {
  const dispatch = useChatDispatch();

  const [
    getMessages,
    { data: initData, loading: initLoading, error: initError },
  ] = useGetMessagesLazyQuery({
    variables: { initialize: true },
    onError: error => toast.error(getErrorContent(error)),
  });

  const account = useAccount();

  React.useEffect(() => {
    if (account) {
      const storageChats =
        localStorage.getItem(`${account.id}-sentChats`) || '';

      if (storageChats !== '') {
        try {
          const savedChats = JSON.parse(storageChats);
          if (savedChats.length > 0) {
            const sender = savedChats[0].sender;
            dispatch({
              type: 'initialized',
              sentChats: savedChats,
              sender,
            });
          }
        } catch (error: any) {
          localStorage.removeItem('sentChats');
        }
      }
      getMessages();
    }
  }, [dispatch, getMessages, account]);

  React.useEffect(() => {
    if (!initLoading && !initError && initData && initData.getMessages) {
      const { messages } = initData.getMessages;

      if (!messages?.length) {
        dispatch({ type: 'initialized' });
        return;
      }

      const lastChat = messages[0]?.id || '';
      const sender = messages[0]?.sender || '';

      dispatch({
        type: 'initialized',
        chats: messages as MessagesType[],
        lastChat,
        sender,
      });
    }
  }, [initLoading, initError, initData, dispatch]);

  return null;
};
