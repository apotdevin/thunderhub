import * as React from 'react';
import { useChatState } from '../src/context/ChatContext';
import { separateBySender, getSenders } from '../src/utils/chat';
import {
  CardWithTitle,
  SubTitle,
  Card,
  SingleLine,
} from '../src/components/generic/Styled';
import { Contacts } from '../src/views/chat/Contacts';
import styled from 'styled-components';
import { ChatBox } from '../src/views/chat/ChatBox';
import { ChatStart } from '../src/views/chat/ChatStart';
import { useStatusState } from '../src/context/StatusContext';
import { Text } from '../src/components/typography/Styled';

const ChatLayout = styled.div`
  display: flex;
  ${({ withHeight = true }: { withHeight: boolean }) =>
    withHeight && 'height: 600px'}
`;

const ChatTitle = styled.div`
  width: 100%;
  text-align: center;
  font-size: 18px;
  margin: 0 0 8px 8px;
`;

const ChatView = () => {
  const { minorVersion } = useStatusState();
  const { chats, sender, sentChats } = useChatState();
  const bySender = separateBySender([...chats, ...sentChats]);
  const senders = getSenders(bySender);

  const [user, setUser] = React.useState('');

  if (minorVersion < 9) {
    return (
      <CardWithTitle>
        <SingleLine>
          <SubTitle>Chat</SubTitle>
        </SingleLine>
        <Card>
          <Text>
            Chatting with other nodes is only available for nodes with LND
            versions 0.9.0-beta and up.
          </Text>
          <Text>If you want to use this feature please update your node.</Text>
        </Card>
      </CardWithTitle>
    );
  }

  const renderChats = () => (
    <>
      <ChatTitle>{user}</ChatTitle>
      <ChatLayout withHeight={user !== 'New Chat'}>
        <Contacts contacts={senders} setUser={setUser} />
        {user === 'New Chat' ? (
          <ChatStart noTitle={true} />
        ) : (
          <ChatBox messages={bySender[sender]} alias={user} />
        )}
      </ChatLayout>
    </>
  );

  return (
    <CardWithTitle>
      <SubTitle>Chats</SubTitle>
      <Card>
        {chats.length <= 0 && sentChats.length <= 0 ? (
          <ChatStart />
        ) : (
          renderChats()
        )}
      </Card>
    </CardWithTitle>
  );
};

export default ChatView;
