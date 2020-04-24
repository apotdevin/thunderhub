import * as React from 'react';
import { useChatState, useChatDispatch } from '../../context/ChatContext';
import { useGetMessagesQuery } from '../../generated/graphql';
import { useAccount } from '../../context/AccountContext';
import { toast } from 'react-toastify';
import { getErrorContent } from '../../utils/error';

export const ChatFetcher = () => {
  const { auth } = useAccount();
  const { initialized, chats } = useChatState();
  const dispatch = useChatDispatch();

  console.log({ initialized, chats });

  const { data, loading, error } = useGetMessagesQuery({
    skip: !auth,
    pollInterval: 10000,
    variables: { auth, initialize: !initialized },
    onError: error => toast.error(getErrorContent(error)),
  });

  React.useEffect(() => {
    if (!loading && !error && data?.getMessages) {
      if (!initialized) {
        console.log({ data });
        dispatch({ type: 'initialized', chats: data.getMessages });
      }
    }
  }, [loading, error, data]);

  return null;
};
