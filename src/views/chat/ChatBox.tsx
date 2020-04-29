import * as React from 'react';
import { MessageType } from './Chat.types';
import {
  getMessageDate,
  getIsDifferentDay,
  getDayChange,
} from '../../components/generic/helpers';
import { sortBy } from 'underscore';
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
} from './Chat.styled';
import { ChatBubble } from './ChatMessage';

export const MessageCard = ({
  message,
  key,
}: {
  message: MessageType;
  key?: string;
}) => {
  if (!message.message) {
    return null;
  }
  const { date, isSent, feePaid } = message;
  return (
    <ChatStyledLine key={key} rightAlign={isSent}>
      <ChatBubble message={message} />
      <ChatFeeDateColumn>
        <ChatStyledDark withMargin={'8px'}>
          {getMessageDate(date)}
        </ChatStyledDark>
        {isSent && feePaid > 0 ? (
          <ChatFeePaid>{`${feePaid} sats`}</ChatFeePaid>
        ) : null}
      </ChatFeeDateColumn>
    </ChatStyledLine>
  );
};

interface ChatBoxProps {
  messages: MessageType[];
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
      <ChatBoxAlias>{alias}</ChatBoxAlias>
    </ChatColumnWithInput>
  );
};
