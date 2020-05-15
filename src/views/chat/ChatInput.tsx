import * as React from 'react';
import { toast } from 'react-toastify';
import { Input } from '../../components/input/Input';
import { SingleLine } from '../../components/generic/Styled';
import { useSendMessageMutation } from '../../generated/graphql';
import { SecureButton } from '../../components/buttons/secureButton/SecureButton';
import { useChatState, useChatDispatch } from '../../context/ChatContext';
import { getErrorContent } from '../../utils/error';
import { useAccount } from '../../context/AccountContext';
import { useConfigState } from '../../context/ConfigContext';
import { handleMessage } from './helpers/chatHelpers';

export const ChatInput = ({
  alias,
  sender: customSender,
  withMargin,
}: {
  alias: string;
  sender?: string;
  withMargin?: string;
}) => {
  const [message, setMessage] = React.useState('');
  const { id } = useAccount();

  const { maxFee } = useConfigState();
  const { sender } = useChatState();
  const dispatch = useChatDispatch();

  const [sendMessage, { loading, data }] = useSendMessageMutation({
    onError: error => toast.error(getErrorContent(error)),
  });

  const [formattedMessage, contentType, tokens, canSend] = handleMessage(
    message
  );

  React.useEffect(() => {
    if (!loading && data?.sendMessage >= 0) {
      setMessage('');
      dispatch({
        type: 'newChat',
        newChat: {
          date: new Date().toISOString(),
          message: formattedMessage,
          sender: customSender || sender,
          isSent: true,
          feePaid: data.sendMessage,
          contentType,
          tokens,
        },
        userId: id,
        sender: customSender || sender,
      });
    }
  }, [
    loading,
    data,
    formattedMessage,
    customSender,
    sender,
    contentType,
    tokens,
    id,
    dispatch,
  ]);

  return (
    <SingleLine>
      <Input
        value={message}
        placeholder={`message ${alias}`}
        withMargin={withMargin}
        onChange={e => setMessage(e.target.value)}
      />
      <SecureButton
        callback={sendMessage}
        loading={loading}
        disabled={loading || message === '' || !canSend}
        variables={{
          message: formattedMessage,
          messageType: contentType,
          publicKey: customSender || sender,
          ...(tokens > 0 && { tokens }),
          maxFee,
        }}
        withMargin={'0 0 0 8px'}
      >
        Send
      </SecureButton>
    </SingleLine>
  );
};
