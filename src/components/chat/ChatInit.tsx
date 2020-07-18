import * as React from 'react';
import { toast } from 'react-toastify';
import { useAccountState } from 'src/context/AccountContext';
import { useGetMessagesLazyQuery } from 'src/graphql/queries/__generated__/getMessages.generated';
import { useChatDispatch } from '../../context/ChatContext';
import { getErrorContent } from '../../utils/error';

export const ChatInit = () => {
  const { auth, account } = useAccountState();
  const dispatch = useChatDispatch();

  const [
    getMessages,
    { data: initData, loading: initLoading, error: initError },
  ] = useGetMessagesLazyQuery({
    variables: { auth, initialize: true },
    onError: error => toast.error(getErrorContent(error)),
  });

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
        } catch (error) {
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
        chats: messages,
        lastChat,
        sender,
      });
    }
  }, [initLoading, initError, initData, dispatch]);

  return null;
};
