import * as React from 'react';
import { useChatState } from '../src/context/ChatContext';
import { separateBySender, getSenders } from '../src/utils/chat';
import {
  CardWithTitle,
  SubTitle,
  Card,
} from '../src/components/generic/Styled';
import { Contacts } from '../src/views/chat/Contacts';
import styled from 'styled-components';
import { ChatBox } from '../src/views/chat/ChatBox';

const ChatLayout = styled.div`
  display: flex;
  height: 600px;
`;

const ChatTitle = styled.div`
  width: 100%;
  text-align: center;
  font-size: 18px;
  margin: 0 0 8px 8px;
`;

const ChatView = () => {
  const { chats, sender, sentChats } = useChatState();
  const bySender = separateBySender([...chats, ...sentChats]);
  const senders = getSenders(bySender);

  const [user, setUser] = React.useState('');

  return (
    <CardWithTitle>
      <SubTitle>Chats</SubTitle>
      <Card>
        <ChatTitle>{user}</ChatTitle>
        <ChatLayout>
          <Contacts contacts={senders} setUser={setUser} />
          <ChatBox messages={bySender[sender]} alias={user} />
        </ChatLayout>
      </Card>
    </CardWithTitle>
  );
};

export default ChatView;
