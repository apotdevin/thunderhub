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
  ChatStyledMessage,
  ChatStyledDark,
  ChatColumnWithInput,
  ChatColumn,
  ChatDaySeparator,
  ChatBoxAlias,
  ChatFeePaid,
  ChatFeeDateColumn,
} from './Chat.styled';

interface ChatBox {
  messages: MessageType[];
  alias: string;
}

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
  const { date, message: chatMessage, isSent, feePaid, verified } = message;
  return (
    <ChatStyledLine key={key} rightAlign={isSent}>
      <ChatStyledMessage verified={isSent || verified} isSent={isSent}>
        {chatMessage}
      </ChatStyledMessage>
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

export const ChatBox = ({ messages, alias }: ChatBox) => {
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
            <div
              style={{ width: '100%' }}
              key={`${message.sender}/${message.date}`}
            >
              {index === sorted.length - 1 && (
                <ChatDaySeparator isLast={true}>
                  {getDayChange(message.date)}
                </ChatDaySeparator>
              )}
              {isDifferent && (
                <ChatDaySeparator>
                  {getDayChange(message.date)}
                </ChatDaySeparator>
              )}
              <MessageCard message={message} />
            </div>
          );
        })}
      </ChatColumn>
      <ChatInput withMargin={'0'} alias={alias} />
      <ChatBoxAlias>{alias}</ChatBoxAlias>
    </ChatColumnWithInput>
  );
};
