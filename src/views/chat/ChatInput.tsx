import * as React from 'react';
import { toast } from 'react-toastify';
import { useAccountState } from 'src/context/AccountContext';
import { useSendMessageMutation } from 'src/graphql/mutations/__generated__/sendMessage.generated';
import { useMutationResultWithReset } from 'src/hooks/UseMutationWithReset';
import { Input } from '../../components/input/Input';
import { SingleLine } from '../../components/generic/Styled';
import { SecureButton } from '../../components/buttons/secureButton/SecureButton';
import { useChatState, useChatDispatch } from '../../context/ChatContext';
import { getErrorContent } from '../../utils/error';
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
  const { account } = useAccountState();

  const { maxFee } = useConfigState();
  const { sender } = useChatState();
  const dispatch = useChatDispatch();

  const [sendMessage, { loading, data: _data }] = useSendMessageMutation({
    onError: error => toast.error(getErrorContent(error)),
  });
  const [data, resetMutationResult] = useMutationResultWithReset(_data);

  const [formattedMessage, contentType, tokens, canSend] = handleMessage(
    message
  );

  React.useEffect(() => {
    if (!loading && data && data.sendMessage >= 0) {
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
        userId: account.id,
        sender: customSender || sender,
      });
      resetMutationResult();
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
