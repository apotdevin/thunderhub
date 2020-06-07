import * as React from 'react';
import { useAccountState } from 'src/context/AccountContext';
import { useGetNodeLazyQuery } from 'src/graphql/queries/__generated__/getNode.generated';
import { useChatDispatch, useChatState } from '../../context/ChatContext';
import { SingleLine } from '../../components/generic/Styled';
import { getMessageDate } from '../../components/generic/helpers';
import { getSubMessage } from '../../utils/chat';
import { MessageType } from './Chat.types';
import {
  ChatContactColumn,
  ChatSubCard,
  ChatContactDate,
  ChatSubText,
} from './Chat.styled';

export const ContactCard = ({
  contact,
  user,
  setUser,
  setShow,
}: {
  contact: MessageType;
  user: string;
  setUser: (active: string) => void;
  setShow: (active: boolean) => void;
}) => {
  const {
    alias,
    sender: contactSender,
    message,
    contentType,
    tokens,
    isSent,
    date,
  } = contact;
  const { sender } = useChatState();
  const dispatch = useChatDispatch();
  const [nodeName, setNodeName] = React.useState(alias || '');

  const { auth, account } = useAccountState();
  const [getInfo, { data, loading }] = useGetNodeLazyQuery({
    variables: { auth, publicKey: contactSender },
  });

  React.useEffect(() => {
    if (alias && contactSender.indexOf(sender) >= 0 && user !== 'New Chat') {
      setUser(alias);
    }
    if (!alias) {
      getInfo();
    }
  }, [contact, sender, alias, contactSender, getInfo, setUser, user]);

  React.useEffect(() => {
    if (!loading && data && data.getNode) {
      const alias = data.getNode?.node?.alias;
      const name =
        alias && alias !== '' ? alias : contactSender.substring(0, 6);
      setNodeName(name);
      if (contactSender.indexOf(sender) >= 0) {
        setUser(name);
      }
    }
  }, [data, loading, sender, contactSender, setUser]);

  return (
    <ChatSubCard
      onClick={() => {
        dispatch({
          type: 'changeActive',
          sender: contactSender,
          userId: account.id,
        });
        setUser(nodeName);
        setShow(false);
      }}
      key={contactSender}
    >
      <SingleLine>
        {nodeName}
        <ChatContactDate>{getMessageDate(date, 'dd/MM/yy')}</ChatContactDate>
      </SingleLine>
      <ChatSubText>
        {getSubMessage(contentType, message, tokens, isSent)}
      </ChatSubText>
    </ChatSubCard>
  );
};

interface ContactsProps {
  user: string;
  hide?: boolean;
  contacts: MessageType[];
  setUser: (active: string) => void;
  setShow: (active: boolean) => void;
}

export const Contacts = ({
  contacts,
  user,
  setUser,
  setShow,
  hide,
}: ContactsProps) => {
  return (
    <ChatContactColumn hide={hide}>
      {contacts.map(contact => {
        if (contact) {
          return (
            <React.Fragment key={contact.sender}>
              <ContactCard
                contact={contact}
                setUser={setUser}
                user={user}
                setShow={setShow}
              />
            </React.Fragment>
          );
        }
      })}
      <ChatSubCard
        onClick={() => {
          setUser('New Chat');
          setShow(false);
        }}
      >
        <div style={{ fontSize: '14px' }}>New Chat</div>
      </ChatSubCard>
    </ChatContactColumn>
  );
};
