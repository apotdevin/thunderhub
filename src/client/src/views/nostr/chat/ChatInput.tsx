import * as React from 'react';
import { toast } from 'react-toastify';
import { useSendMessageMutation } from '../../../graphql/mutations/__generated__/sendMessage.generated';
import { useMutationResultWithReset } from '../../../hooks/UseMutationWithReset';
import { ColorButton } from '../../../components/buttons/colorButton/ColorButton';
import { useAccount } from '../../../hooks/UseAccount';
import { Input } from '../../../components/input';
import { SingleLine } from '../../../components/generic/Styled';
import { useChatState, useChatDispatch } from '../../../context/ChatContext';
import { getErrorContent } from '../../../utils/error';
import { useConfigState } from '../../../context/ConfigContext';
import { handleMessage } from '../helpers/chatHelpers';

export const ChatInput = ({
  alias,
  sender: customSender,
  withMargin,
  callback,
}: {
  alias: string;
  sender?: string;
  withMargin?: string;
  callback?: () => void;
}) => {
  const [message, setMessage] = React.useState('');

  const { maxFee } = useConfigState();
  const { sender } = useChatState();
  const dispatch = useChatDispatch();

  const account = useAccount();

  const [sendMessage, { loading, data: _data }] = useSendMessageMutation({
    onError: error => toast.error(getErrorContent(error)),
  });
  const [data, resetMutationResult] = useMutationResultWithReset(_data);

  const [formattedMessage, contentType, tokens, canSend] =
    handleMessage(message);

  React.useEffect(() => {
    if (!loading && account && data?.sendMessage) {
      setMessage('');
      dispatch({
        type: 'newChat',
        newChat: {
          id: '',
          verified: true,
          date: new Date().toISOString(),
          message: formattedMessage,
          sender: customSender || sender,
          isSent: true,
          feePaid: data.sendMessage - 1,
          contentType,
          tokens,
        },
        userId: account.id,
        sender: customSender || sender,
      });
      resetMutationResult();
      callback && callback();
    }
  }, [
    loading,
    data,
    formattedMessage,
    customSender,
    sender,
    contentType,
    tokens,
    account,
    dispatch,
    resetMutationResult,
    callback,
    alias,
  ]);

  const handleClick = () => {
    if (loading || message === '' || !canSend) return;
    sendMessage({
      variables: {
        message: formattedMessage,
        messageType: contentType,
        publicKey: customSender || sender,
        ...(tokens > 0 && { tokens }),
        maxFee,
      },
    });
  };

  return (
    <SingleLine>
      <Input
        value={message}
        placeholder={`message ${alias}`}
        withMargin={withMargin}
        onChange={e => setMessage(e.target.value)}
        onEnter={() => handleClick()}
      />
      <ColorButton
        loading={loading}
        disabled={loading || message === '' || !canSend}
        withMargin={'0 0 0 8px'}
        onClick={() => handleClick()}
      >
        Send
      </ColorButton>
    </SingleLine>
  );
};
