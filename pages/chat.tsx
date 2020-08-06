import * as React from 'react';
import styled from 'styled-components';
import { Users } from 'react-feather';
import { GridWrapper } from 'src/components/gridWrapper/GridWrapper';
import { ChatInit } from 'src/components/chat/ChatInit';
import { ChatFetcher } from 'src/components/chat/ChatFetcher';
import { NextPageContext } from 'next';
import { getProps } from 'src/utils/ssr';
import { GET_MESSAGES } from 'src/graphql/queries/getMessages';
import { useNodeInfo } from 'src/hooks/UseNodeInfo';
import { useChatState } from '../src/context/ChatContext';
import { separateBySender, getSenders } from '../src/utils/chat';
import {
  CardWithTitle,
  SubTitle,
  Card,
  SingleLine,
} from '../src/components/generic/Styled';
import { Contacts } from '../src/views/chat/Contacts';
import { ChatBox } from '../src/views/chat/ChatBox';
import { ChatStart } from '../src/views/chat/ChatStart';
import { Text } from '../src/components/typography/Styled';
import { LoadingCard } from '../src/components/loading/LoadingCard';
import { ChatCard } from '../src/views/chat/Chat.styled';
import { ViewSwitch } from '../src/components/viewSwitch/ViewSwitch';
import { ColorButton } from '../src/components/buttons/colorButton/ColorButton';

const ChatLayout = styled.div`
  display: flex;
  ${({ withHeight = true }: { withHeight: boolean }) =>
    withHeight && 'height: 600px'}
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
  const { minorVersion } = useNodeInfo();
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

  if (minorVersion < 9 && initialized) {
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

const Wrapped = () => (
  <GridWrapper>
    <ChatInit />
    <ChatFetcher />
    <ChatView />
  </GridWrapper>
);

export default Wrapped;

export async function getServerSideProps(context: NextPageContext) {
  return await getProps(context, [GET_MESSAGES]);
}
