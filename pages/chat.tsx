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

const ChatView = () => {
  const { chats, initialized } = useChatState();
  const bySender = separateBySender(chats);
  const senders = getSenders(bySender);

  const [active, setActive] = React.useState('');

  console.log({ bySender, senders, active });

  React.useEffect(() => {
    if (senders.length > 0) {
      setActive(senders[0].key);
    }
  }, [chats]);

  return (
    <CardWithTitle>
      <SubTitle>Chats</SubTitle>
      <Card>
        <ChatLayout>
          <Contacts contacts={senders} setActive={setActive} />
          <ChatBox messages={bySender[active]} />
        </ChatLayout>
      </Card>
    </CardWithTitle>
  );
};

export default ChatView;
