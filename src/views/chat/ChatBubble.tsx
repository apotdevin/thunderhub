import * as React from 'react';
import { MessageType } from './Chat.types';
import {
  ChatStyledMessage,
  ChatBubbleMessage,
  StatusChatDot,
  ChatSendButton,
} from './Chat.styled';
import {
  chatBubbleColor,
  chatSentBubbleColor,
  chartColors,
} from '../../styles/Themes';
import { useSendMessageMutation } from '../../generated/graphql';
import { toast } from 'react-toastify';
import { getErrorContent } from '../../utils/error';
import { SecureWrapper } from '../../components/buttons/secureButton/SecureWrapper';
import { useChatState, useChatDispatch } from '../../context/ChatContext';
import { useAccount } from '../../context/AccountContext';
import { Circle } from 'react-feather';
import ScaleLoader from 'react-spinners/ScaleLoader';
import { useSettings } from '../../context/SettingsContext';
import { usePriceState } from '../../context/PriceContext';
import { getPrice } from '../../components/price/Price';

interface SendButtonProps {
  amount: number;
}

const SendButton = ({ amount }: SendButtonProps) => {
  const { sender, maxFee } = useChatState();
  const dispatch = useChatDispatch();
  const { id } = useAccount();

  const [sendMessage, { loading, data }] = useSendMessageMutation({
    onError: error => toast.error(getErrorContent(error)),
  });

  React.useEffect(() => {
    if (!loading && data?.sendMessage >= 0) {
      dispatch({
        type: 'newChat',
        newChat: {
          date: new Date().toISOString(),
          message: 'payment',
          sender,
          isSent: true,
          feePaid: data.sendMessage,
          contentType: 'payment',
          tokens: amount,
        },
        userId: id,
        sender,
      });
    }
  }, [loading, data]);

  return (
    <SecureWrapper
      color={'red'}
      callback={sendMessage}
      variables={{
        message: 'payment',
        messageType: 'payment',
        publicKey: sender,
        tokens: amount,
        maxFee,
      }}
    >
      <ChatSendButton>
        {loading ? <ScaleLoader height={8} color={'white'} width={2} /> : 'Pay'}
      </ChatSendButton>
    </SecureWrapper>
  );
};

interface ChatBubbleProps {
  message: MessageType;
}

export const ChatBubble = ({ message }: ChatBubbleProps) => {
  const { currency } = useSettings();
  const priceContext = usePriceState();
  const format = getPrice(currency, priceContext);

  const {
    contentType,
    message: chatMessage,
    isSent,
    verified,
    tokens,
  } = message;

  let color = chatBubbleColor;
  let textMessage = chatMessage;
  let dotColor = '';
  let showButton = false;
  let amount = 0;

  if (isSent) {
    color = chatSentBubbleColor;
    if (contentType === 'payment') {
      dotColor = chartColors.red;
      if (chatMessage === 'payment') {
        textMessage = `You sent ${format({ amount: tokens })}`;
      } else {
        textMessage = `${chatMessage} (${format({ amount: tokens })})`;
      }
    } else if (contentType === 'paymentrequest') {
      if (chatMessage === 'paymentrequest') {
        textMessage = `You requested ${format({ amount: tokens })}`;
      } else {
        textMessage = `${chatMessage} (${format({ amount: tokens })})`;
      }
    }
  } else {
    if (contentType === 'payment') {
      dotColor = chartColors.green;
      if (chatMessage === 'payment' || !chatMessage) {
        textMessage = `You received ${format({ amount: tokens })}`;
      } else {
        textMessage = `${chatMessage} (${format({ amount: tokens })})`;
      }
    } else if (contentType === 'paymentrequest') {
      showButton = true;
      const messageSplit = chatMessage.split(',');
      amount = verified
        ? Number(messageSplit[0])
        : Math.abs(Number(messageSplit[0]) / 1000); // This is only for Juggernaut compatibility.
      const finalMessage = [...messageSplit];
      finalMessage.shift();
      if (messageSplit[1] === 'paymentrequest' || !messageSplit[1]) {
        textMessage = `${format({ amount })} requested from you`;
      } else {
        textMessage = `${finalMessage.join(' ')} (${format({ amount })})`;
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
