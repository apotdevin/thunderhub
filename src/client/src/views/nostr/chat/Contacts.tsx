import * as React from 'react';
import { useGetNodeLazyQuery } from '../../../graphql/queries/__generated__/getNode.generated';
import { useAccount } from '../../../hooks/UseAccount';
import {
  useChatDispatch,
  useChatState,
  SentChatProps,
} from '../../../context/ChatContext';
import { SingleLine } from '../../../components/generic/Styled';
import { getMessageDate } from '../../../components/generic/helpers';
import { getSubMessage } from '../../../utils/chat';
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
  setName,
}: {
  contact: SentChatProps;
  user: string;
  setUser: (name: string) => void;
  setName: (name: string) => void;
}) => {
  const {
    alias = '',
    sender: contactSender = '',
    message = '',
    contentType = '',
    tokens = 0,
    isSent = false,
    date = '',
  } = contact;
  const { sender } = useChatState();
  const dispatch = useChatDispatch();
  const [nodeName, setNodeName] = React.useState(alias || '');

  const account = useAccount();

  const [getInfo, { data, loading }] = useGetNodeLazyQuery({
    variables: { publicKey: contactSender || '' },
  });

  React.useEffect(() => {
    if (!alias) {
      getInfo();
    }

    if (alias && contactSender && contactSender.indexOf(sender) >= 0 && !user) {
      setName(alias);
    }
  }, [alias, getInfo, contactSender, setName, sender, user]);

  React.useEffect(() => {
    if (loading || !data?.getNode) return;

    const alias = data.getNode?.node?.alias;
    const name =
      alias && alias !== '' ? alias : (contactSender || '-').substring(0, 6);
    setNodeName(name);

    if (!user && contactSender && contactSender.indexOf(sender) >= 0) {
      setName(name);
    }
  }, [data, loading, contactSender, sender, setName, user]);

  return (
    <ChatSubCard
      onClick={() => {
        contactSender &&
          dispatch({
            type: 'changeActive',
            sender: contactSender,
            userId: account?.id || '',
          });
        setUser(nodeName);
      }}
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
  contacts: SentChatProps[];
  setUser: (name: string) => void;
  setName: (name: string) => void;
}

export const Contacts = ({
  contacts,
  user,
  setUser,
  setName,
  hide,
}: ContactsProps) => {
  return (
    <ChatContactColumn hide={hide}>
      {contacts.map((contact, index) => {
        if (contact) {
          return (
            <React.Fragment key={contact.sender || index}>
              <ContactCard
                contact={contact}
                setUser={setUser}
                user={user}
                setName={setName}
              />
            </React.Fragment>
          );
        }
      })}
      <ChatSubCard onClick={() => setUser('New Chat')}>
        <div style={{ fontSize: '14px' }}>New Chat</div>
      </ChatSubCard>
    </ChatContactColumn>
  );
};
