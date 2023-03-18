import * as React from 'react';
import { sortBy } from 'lodash';
import { Message } from '../../../graphql/types';
import { SentChatProps } from '../../../context/ChatContext';
import {
  getMessageDate,
  getIsDifferentDay,
  getDayChange,
} from '../../../components/generic/helpers';
import { useConfigState } from '../../../context/ConfigContext';
import { ChatInput } from './ChatInput';
import {
  ChatStyledLine,
  ChatStyledDark,
  ChatColumnWithInput,
  ChatColumn,
  ChatDaySeparator,
  ChatBoxAlias,
  ChatFeePaid,
  ChatFeeDateColumn,
  ChatBoxTopAlias,
} from './Chat.styled';
import { ChatBubble } from './ChatBubble';

export const MessageCard = ({
  message,
  key,
}: {
  message: SentChatProps;
  key?: string;
}) => {
  const { hideFee, hideNonVerified } = useConfigState();
  if (!message.message && message.contentType === 'text') {
    return null;
  }
  const { date, isSent, feePaid, verified } = message;

  if (hideNonVerified && !verified && !isSent) return null;

  return (
    <ChatStyledLine key={key} rightAlign={isSent || false}>
      <ChatBubble message={message} />
      <ChatFeeDateColumn>
        {!hideFee && isSent && feePaid && feePaid > 0 ? (
          <ChatFeePaid>{`${feePaid} sats`}</ChatFeePaid>
        ) : null}
        <ChatStyledDark withMargin={'8px'}>
          {getMessageDate(date)}
        </ChatStyledDark>
      </ChatFeeDateColumn>
    </ChatStyledLine>
  );
};

interface ChatBoxProps {
  messages: Message[];
  alias: string;
}

export const ChatBox = ({ messages, alias }: ChatBoxProps) => {
  if (!messages) {
    return null;
  }

  const sorted = sortBy(messages, 'date').reverse();

  return (
    <ChatColumnWithInput>
      <ChatColumn>
        {sorted.map((message, index: number) => {
          const nextDate =
            index < sorted.length - 1 ? sorted[index + 1].date : message.date;
          const isDifferent = getIsDifferentDay(message.date, nextDate);
          return (
            <React.Fragment key={`${message.sender}/${message.date}`}>
              <MessageCard message={message} />
              {isDifferent && (
                <ChatDaySeparator>
                  {getDayChange(message.date)}
                </ChatDaySeparator>
              )}
              {index === sorted.length - 1 && (
                <ChatDaySeparator isLast={true}>
                  {getDayChange(message.date)}
                </ChatDaySeparator>
              )}
            </React.Fragment>
          );
        })}
      </ChatColumn>
      <ChatInput withMargin={'0'} alias={alias} />
      <ChatBoxAlias>
        <ChatBoxTopAlias>{alias}</ChatBoxTopAlias>
      </ChatBoxAlias>
    </ChatColumnWithInput>
  );
};
