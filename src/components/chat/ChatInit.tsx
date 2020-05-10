import * as React from 'react';
import { useChatDispatch } from '../../context/ChatContext';
import { useGetMessagesLazyQuery } from '../../generated/graphql';
import { useAccount } from '../../context/AccountContext';
import { toast } from 'react-toastify';
import { getErrorContent } from '../../utils/error';

export const ChatInit = () => {
  const { auth, id } = useAccount();
  const dispatch = useChatDispatch();

  const [
    getMessages,
    { data: initData, loading: initLoading, error: initError },
  ] = useGetMessagesLazyQuery({
    variables: { auth, initialize: true },
    onError: error => toast.error(getErrorContent(error)),
  });

  React.useEffect(() => {
    const storageChats = localStorage.getItem(`${id}-sentChats`) || '';
    const hideFee = localStorage.getItem('hideFee') === 'true' ? true : false;
    const hideNonVerified =
      localStorage.getItem('hideNonVerified') === 'true' ? true : false;
    const maxFee = Number(localStorage.getItem('maxChatFee')) || 20;
    const chatPollingSpeed =
      Number(localStorage.getItem('chatPollingSpeed')) || 1000;

    if (storageChats !== '') {
      try {
        const savedChats = JSON.parse(storageChats);
        if (savedChats.length > 0) {
          const sender = savedChats[0].sender;
          dispatch({
            type: 'initialized',
            sentChats: savedChats,
            sender,
            hideFee,
            hideNonVerified,
            maxFee,
            chatPollingSpeed,
          });
        }
      } catch (error) {
        localStorage.removeItem('sentChats');
      }
    }
    getMessages();
  }, [dispatch, getMessages, id]);

  React.useEffect(() => {
    if (!initLoading && !initError && initData?.getMessages) {
      const { messages } = initData.getMessages;

      if (messages.length <= 0) {
        dispatch({ type: 'initialized' });
        return;
      }

      const lastChat = messages[0].id || '';
      const sender = messages[0].sender || '';

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
