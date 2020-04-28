import * as React from 'react';
import { Input } from '../../components/input/Input';
import { SingleLine } from '../../components/generic/Styled';
import { useSendMessageMutation } from '../../generated/graphql';
import { SecureButton } from '../../components/buttons/secureButton/SecureButton';
import { useChatState, useChatDispatch } from '../../context/ChatContext';
import { toast } from 'react-toastify';
import { getErrorContent } from '../../utils/error';
import { useAccount } from '../../context/AccountContext';

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

  const { sender } = useChatState();
  const dispatch = useChatDispatch();

  const [sendMessage, { loading, data }] = useSendMessageMutation({
    onError: error => toast.error(getErrorContent(error)),
  });

  React.useEffect(() => {
    if (!loading && data?.sendMessage >= 0) {
      setMessage('');
      dispatch({
        type: 'newChat',
        newChat: {
          date: new Date().toISOString(),
          message,
          sender: customSender || sender,
          isSent: true,
          feePaid: data.sendMessage,
        },
        userId: id,
        sender: customSender || sender,
      });
    }
  }, [loading, data]);

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
        disabled={loading}
        variables={{
          message,
          publicKey: customSender || sender,
          tokens: 30,
          maxFee: 100,
        }}
        withMargin={'0 0 0 8px'}
      >
        Send
      </SecureButton>
    </SingleLine>
  );
};
