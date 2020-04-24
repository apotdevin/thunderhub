import * as React from 'react';
import styled from 'styled-components';
import { MessageType } from './Chat.types';
import {
  getMessageDate,
  getIsDifferentDay,
  getDayChange,
} from '../../components/generic/helpers';
import { DetailLine } from '../../components/generic/CardGeneric';
import {
  OverflowText,
  DarkSubTitle,
  SingleLine,
} from '../../components/generic/Styled';
import { cardBorderColor, subCardColor } from '../../styles/Themes';
import { sortBy } from 'underscore';
import { NoWrap } from '../tools/Tools.styled';
import { Input } from '../../components/input/Input';
import { ColorButton } from '../../components/buttons/colorButton/ColorButton';

const ContactColumn = styled.div`
  display: flex;
  flex-direction: column-reverse;
  justify-content: flex-start;
  align-items: flex-start;
  overflow-y: auto;
  overflow-x: hidden;
  border: 1px solid ${cardBorderColor};
  margin: 0 0 10px 10px;
  padding-bottom: 8px;
`;

const ColumnWithInput = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`;

const StyledLine = styled(DetailLine)`
  width: 100%;
  align-items: center;
`;

const DaySeparator = styled.div`
  width: 100%;
  font-size: 14px;
  text-align: center;
  margin: 8px 16px;
  padding: 8px;
`;

const StyledChatMessage = styled(OverflowText)`
  background-color: ${subCardColor};
  max-width: 60%;
  padding: 8px 16px;
  border-radius: 8px;
`;

const ChatTitle = styled.div`
  width: 100%;
  text-align: center;
  font-size: 18px;
  margin: 0 0 8px 8px;
`;

interface ChatBox {
  messages: MessageType[];
  alias: string;
}

export const MessageCard = ({ message }: { message: MessageType }) => {
  if (!message.message) {
    return null;
  }
  return (
    <StyledLine key={message.id}>
      <StyledChatMessage>{message.message}</StyledChatMessage>
      <DarkSubTitle withMargin={'8px'}>
        <NoWrap>{getMessageDate(message.date)}</NoWrap>
      </DarkSubTitle>
    </StyledLine>
  );
};

export const ChatBox = ({ messages, alias }: ChatBox) => {
  if (!messages) {
    return null;
  }

  const sorted = sortBy(messages, 'date').reverse();

  return (
    <ColumnWithInput>
      <ChatTitle>{`- ${alias} -`}</ChatTitle>
      <ContactColumn>
        {sorted.map((message, index: number) => {
          const nextDate =
            index < sorted.length - 1 ? sorted[index + 1].date : message.date;
          const isDifferent = getIsDifferentDay(message.date, nextDate);
          return (
            <>
              <MessageCard message={message} />
              {isDifferent && (
                <DaySeparator>{getDayChange(nextDate)}</DaySeparator>
              )}
            </>
          );
        })}
      </ContactColumn>
      <SingleLine>
        <Input
          // fullWidth={false}
          placeholder={'Message'}
          withMargin={'0 8px 0 16px'}
          onChange={() => {}}
        />
        <ColorButton>Send</ColorButton>
      </SingleLine>
    </ColumnWithInput>
  );
};
