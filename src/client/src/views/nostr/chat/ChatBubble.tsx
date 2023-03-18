import * as React from 'react';
import { ThemeSet } from 'styled-theming';
import { toast } from 'react-toastify';
import { Circle } from 'react-feather';
import ScaleLoader from 'react-spinners/ScaleLoader';
import { useSendMessageMutation } from '../../../graphql/mutations/__generated__/sendMessage.generated';
import { useMutationResultWithReset } from '../../../hooks/UseMutationWithReset';
import { useAccount } from '../../../hooks/UseAccount';
import {
  chatBubbleColor,
  chatSentBubbleColor,
  chartColors,
} from '../../../styles/Themes';
import { getErrorContent } from '../../../utils/error';
import {
  useChatState,
  useChatDispatch,
  SentChatProps,
} from '../../../context/ChatContext';
import { useConfigState } from '../../../context/ConfigContext';
import { usePriceState } from '../../../context/PriceContext';
import { getPrice } from '../../../components/price/Price';
import {
  ChatStyledMessage,
  ChatBubbleMessage,
  StatusChatDot,
  ChatSendButton,
} from './Chat.styled';

interface SendButtonProps {
  amount: number;
}

const SendButton = ({ amount }: SendButtonProps) => {
  const { maxFee } = useConfigState();
  const { sender } = useChatState();
  const dispatch = useChatDispatch();

  const account = useAccount();

  const [sendMessage, { loading, data: _data }] = useSendMessageMutation({
    onError: error => toast.error(getErrorContent(error)),
  });
  const [data, resetMutationResult] = useMutationResultWithReset(_data);

  React.useEffect(() => {
    if (!loading && data && data?.sendMessage) {
      dispatch({
        type: 'newChat',
        newChat: {
          id: '',
          verified: true,
          date: new Date().toISOString(),
          message: 'payment',
          sender,
          isSent: true,
          feePaid: data.sendMessage - 1,
          contentType: 'payment',
          tokens: amount,
        },
        userId: account?.id || '',
        sender,
      });
      resetMutationResult();
    }
  }, [loading, data, amount, dispatch, sender, account, resetMutationResult]);

  return (
    <ChatSendButton
      onClick={() =>
        sendMessage({
          variables: {
            message: 'payment',
            messageType: 'payment',
            publicKey: sender,
            tokens: amount,
            maxFee,
          },
        })
      }
    >
      {loading ? <ScaleLoader height={8} color={'white'} width={2} /> : 'Pay'}
    </ChatSendButton>
  );
};

interface ChatBubbleProps {
  message: SentChatProps;
}

export const ChatBubble = ({ message }: ChatBubbleProps) => {
  const { currency, displayValues } = useConfigState();
  const priceContext = usePriceState();
  const format = getPrice(currency, displayValues, priceContext);

  const {
    contentType,
    message: chatMessage = '',
    isSent,
    verified,
    tokens = 0,
  } = message;

  let color: ThemeSet | string = chatBubbleColor;
  let textMessage: JSX.Element | string = chatMessage || '';
  let dotColor = '';
  let showButton = false;
  let amount = 0;

  if (isSent) {
    color = chatSentBubbleColor;
    if (contentType === 'payment') {
      dotColor = chartColors.red;
      if (chatMessage === 'payment') {
        textMessage = (
          <>
            {'You sent '}
            {format({ amount: tokens })}
          </>
        );
      } else {
        textMessage = (
          <>
            {chatMessage}
            {'('}
            {format({ amount: tokens })}
            {')'}
          </>
        );
      }
    } else if (contentType === 'paymentrequest') {
      if (chatMessage === 'paymentrequest') {
        textMessage = (
          <>
            {'You requested '}
            {format({ amount: tokens })}
          </>
        );
      } else {
        textMessage = (
          <>
            {chatMessage}
            {'('}
            {format({ amount: tokens })}
            {')'}
          </>
        );
      }
    }
  } else {
    if (contentType === 'payment') {
      dotColor = chartColors.green;
      if (chatMessage === 'payment' || !chatMessage) {
        textMessage = (
          <>
            {'You received '}
            {format({ amount: tokens })}
          </>
        );
      } else {
        textMessage = (
          <>
            {chatMessage}
            {'('}
            {format({ amount: tokens })}
            {')'}
          </>
        );
      }
    } else if (contentType === 'paymentrequest') {
      showButton = true;
      const messageSplit = chatMessage?.split(',') || [''];
      amount = verified
        ? Number(messageSplit[0])
        : Math.abs(Number(messageSplit[0]) / 1000); // This is only for Juggernaut compatibility.
      const finalMessage = [...messageSplit];
      finalMessage.shift();
      if (messageSplit[1] === 'paymentrequest' || !messageSplit[1]) {
        textMessage = (
          <>
            {format({ amount: tokens })}
            {' requested from you'}
          </>
        );
      } else {
        textMessage = (
          <>
            {finalMessage.join(' ')}
            {'('}
            {format({ amount: tokens })}
            {')'}
          </>
        );
      }
    }
  }

  if (contentType === 'paymentrequest') {
    dotColor = 'white';
  }

  if (!verified && !isSent) {
    color = 'black';
  }

  return (
    <ChatStyledMessage bubbleColor={color}>
      <ChatBubbleMessage>
        {textMessage}
        {showButton && <SendButton amount={amount} />}
      </ChatBubbleMessage>
      {dotColor !== '' && (
        <StatusChatDot>
          <Circle size={10} color={dotColor} fill={dotColor} />
        </StatusChatDot>
      )}
    </ChatStyledMessage>
  );
};
