import * as React from 'react';
import { MessageType } from './Chat.types';
import {
  getMessageDate,
  getIsDifferentDay,
  getDayChange,
} from '../../components/generic/helpers';
import { sortBy } from 'underscore';
import { NoWrap } from '../tools/Tools.styled';
import { ChatInput } from './ChatInput';
import {
  ChatStyledLine,
  ChatStyledMessage,
  ChatStyledDark,
  ChatColumnWithInput,
  ChatColumn,
  ChatDaySeparator,
  ChatBoxAlias,
} from './Chat.styled';
import { DarkSubTitle } from '../../components/generic/Styled';

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
  const { date, message: chatMessage, isSent, feePaid } = message;
  return (
    <ChatStyledLine key={key} rightAlign={isSent}>
      {isSent && feePaid > 0 ? (
        <DarkSubTitle>{`${feePaid} sats`}</DarkSubTitle>
      ) : null}
      <ChatStyledMessage isSent={isSent}>{chatMessage}</ChatStyledMessage>
      <ChatStyledDark withMargin={'8px'}>
        <NoWrap>{getMessageDate(date)}</NoWrap>
      </ChatStyledDark>
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
                <ChatDaySeparator>
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
      <ChatInput withMargin={'0 8px 0 16px'} alias={alias} />
      <ChatBoxAlias>{alias}</ChatBoxAlias>
    </ChatColumnWithInput>
  );
};
