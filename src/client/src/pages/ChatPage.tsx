import * as React from 'react';
import styled from 'styled-components';
import { Users } from 'react-feather';
import { GridWrapper } from '../components/gridWrapper/GridWrapper';
import { ChatInit } from '../components/chat/ChatInit';
import { ChatFetcher } from '../components/chat/ChatFetcher';
import { useChatState } from '../context/ChatContext';
import { separateBySender, getSenders } from '../utils/chat';
import {
  CardWithTitle,
  SubTitle,
  SingleLine,
} from '../components/generic/Styled';
import { Contacts } from '../views/chat/Contacts';
import { ChatBox } from '../views/chat/ChatBox';
import { ChatStart } from '../views/chat/ChatStart';
import { LoadingCard } from '../components/loading/LoadingCard';
import { ChatCard } from '../views/chat/Chat.styled';
import { ViewSwitch } from '../components/viewSwitch/ViewSwitch';
import { ColorButton } from '../components/buttons/colorButton/ColorButton';

const ChatLayout = styled.div<{ withHeight: boolean }>`
  display: flex;
  ${({ withHeight = true }) => withHeight && 'height: 600px'}
`;

type State = {
  user: string;
  showContacts: boolean;
};

type Action =
  | {
      type: 'setUserAndHide' | 'setUser';
      user: string;
    }
  | { type: 'toggleShow' };

const initialState: State = { user: '', showContacts: false };

const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'setUser':
      return { ...state, user: action.user };
    case 'setUserAndHide':
      return { user: action.user, showContacts: false };
    case 'toggleShow':
      return { ...state, showContacts: !state.showContacts };
    default:
      return state;
  }
};

const ChatView = () => {
  const { chats, sender, sentChats, initialized } = useChatState();
  const bySender = separateBySender([...chats, ...sentChats]);
  const senders = getSenders(bySender) || [];

  const [state, dispatch] = React.useReducer(reducer, initialState);
  const { user, showContacts } = state;

  const setUser = (user: string) => dispatch({ type: 'setUserAndHide', user });
  const setName = (user: string) => dispatch({ type: 'setUser', user });

  if (!initialized) {
    return <LoadingCard title={'Chats'} />;
  }

  const renderChats = () => {
    if (showContacts) {
      return (
        <Contacts
          contacts={senders}
          user={user}
          setUser={setUser}
          setName={setName}
        />
      );
    }
    return (
      <ChatLayout withHeight={user !== 'New Chat'}>
        <Contacts
          contacts={senders}
          user={user}
          setUser={setUser}
          setName={setName}
          hide={true}
        />
        {user === 'New Chat' ? (
          <ChatStart noTitle={true} callback={() => setUser('')} />
        ) : (
          <ChatBox messages={bySender[sender]} alias={user} />
        )}
      </ChatLayout>
    );
  };

  return (
    <CardWithTitle>
      {!showContacts && user !== 'New Chat' && (
        <>
          <ViewSwitch hideMobile={true}>
            <SingleLine>
              <SubTitle>Chat</SubTitle>
            </SingleLine>
          </ViewSwitch>
          <ViewSwitch>
            <SingleLine>
              <ColorButton onClick={() => dispatch({ type: 'toggleShow' })}>
                <Users size={18} />
              </ColorButton>
              <SubTitle>{user}</SubTitle>
            </SingleLine>
          </ViewSwitch>
        </>
      )}
      <ChatCard mobileCardPadding={'0'}>
        {chats.length <= 0 && sentChats.length <= 0 ? (
          <ChatStart callback={() => setUser('')} />
        ) : (
          renderChats()
        )}
      </ChatCard>
    </CardWithTitle>
  );
};

const ChatPage = () => (
  <GridWrapper>
    <ChatInit />
    <ChatFetcher />
    <ChatView />
  </GridWrapper>
);

export default ChatPage;
