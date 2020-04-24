import * as React from 'react';
import { useChatDispatch } from '../../context/ChatContext';
import { useGetMessagesLazyQuery } from '../../generated/graphql';
import { useAccount } from '../../context/AccountContext';
import { toast } from 'react-toastify';
import { getErrorContent } from '../../utils/error';

export const ChatInit = () => {
  const { auth } = useAccount();
  const dispatch = useChatDispatch();

  const [
    getMessages,
    { data: initData, loading: initLoading, error: initError },
  ] = useGetMessagesLazyQuery({
    variables: { auth, initialize: true },
    onError: error => toast.error(getErrorContent(error)),
  });

  // let savedChats = [];
  React.useEffect(() => {
    // const storageChats = localStorage.getItem('incomingChats') || '';
    // if (storageChats !== '') {
    //   try {
    //     savedChats = JSON.parse(storageChats);
    //     const lastChat = savedChats[0].id;
    //     dispatch({ type: 'initialized', chats: savedChats, lastChat });
    //   } catch (error) {
    //     localStorage.removeItem('incomingChats');
    //     getMessages();
    //   }
    // } else {
    getMessages();
    // }
  }, []);

  React.useEffect(() => {
    if (!initLoading && !initError && initData?.getMessages) {
      const { messages } = initData.getMessages;

      //   localStorage.setItem('incomingChats', JSON.stringify(messages));
      const lastChat = messages[0].id;
      dispatch({
        type: 'initialized',
        chats: messages,
        lastChat,
      });
    }
  }, [initLoading, initError, initData]);

  return null;
};
