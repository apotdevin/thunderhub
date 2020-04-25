import * as React from 'react';
import { useGetNodeLazyQuery } from '../../generated/graphql';
import { useAccount } from '../../context/AccountContext';
import { useChatDispatch, useChatState } from '../../context/ChatContext';
import { ChatStyledSubCard, ChatContactColumn } from './Chat.styled';
import { DarkSubTitle } from '../../components/generic/Styled';

export const ContactCard = ({
  contact,
  setUser,
}: {
  contact: { key: string; alias: string };
  setUser: (active: string) => void;
}) => {
  const { sender } = useChatState();
  const dispatch = useChatDispatch();
  const [nodeName, setNodeName] = React.useState(contact.alias || '');

  const { auth, id } = useAccount();
  const [getInfo, { data, loading }] = useGetNodeLazyQuery({
    variables: { auth, publicKey: contact.key },
  });

  React.useEffect(() => {
    if (!contact.alias) {
      getInfo();
    }
  }, [contact]);

  React.useEffect(() => {
    if (!loading && data?.getNode) {
      const { alias } = data.getNode;
      const name = alias && alias !== '' ? alias : contact.key.substring(0, 6);
      setNodeName(name);

      if (contact.key.indexOf(sender) >= 0) {
        setUser(name);
      }
    }
  }, [data, loading]);

  return (
    <ChatStyledSubCard
      onClick={() => {
        dispatch({ type: 'changeActive', sender: contact.key, userId: id });
        setUser(nodeName);
      }}
      key={contact.key}
    >
      {nodeName}
    </ChatStyledSubCard>
  );
};

interface ContactsProps {
  contacts: { key: string; alias: string }[];
  setUser: (active: string) => void;
}

export const Contacts = ({ contacts, setUser }: ContactsProps) => {
  return (
    <ChatContactColumn>
      {contacts.map(contact => {
        if (contact) {
          return (
            <div style={{ width: '100%' }} key={contact.key}>
              <ContactCard contact={contact} setUser={setUser} />
            </div>
          );
        }
      })}
      <ChatStyledSubCard onClick={() => setUser('New Chat')}>
        <DarkSubTitle>New Chat</DarkSubTitle>
      </ChatStyledSubCard>
    </ChatContactColumn>
  );
};
