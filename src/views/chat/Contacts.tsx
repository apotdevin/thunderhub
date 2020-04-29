import * as React from 'react';
import { useGetNodeLazyQuery } from '../../generated/graphql';
import { useAccount } from '../../context/AccountContext';
import { useChatDispatch, useChatState } from '../../context/ChatContext';
import { ChatContactColumn, ChatSubCard } from './Chat.styled';

export const ContactCard = ({
  contact,
  user,
  setUser,
  setShow,
}: {
  contact: { key: string; alias: string };
  user: string;
  setUser: (active: string) => void;
  setShow: (active: boolean) => void;
}) => {
  const { sender } = useChatState();
  const dispatch = useChatDispatch();
  const [nodeName, setNodeName] = React.useState(contact.alias || '');

  const { auth, id } = useAccount();
  const [getInfo, { data, loading }] = useGetNodeLazyQuery({
    variables: { auth, publicKey: contact.key },
  });

  React.useEffect(() => {
    if (
      contact.alias &&
      contact.key.indexOf(sender) >= 0 &&
      user !== 'New Chat'
    ) {
      setUser(contact.alias);
    }
    if (!contact.alias) {
      getInfo();
    }
  }, [contact, sender]);

  React.useEffect(() => {
    if (!loading && data?.getNode) {
      const { alias } = data.getNode;
      const name = alias && alias !== '' ? alias : contact.key.substring(0, 6);
      setNodeName(name);
      if (contact.key.indexOf(sender) >= 0) {
        setUser(name);
      }
    }
  }, [data, loading, sender]);

  return (
    <ChatSubCard
      onClick={() => {
        dispatch({ type: 'changeActive', sender: contact.key, userId: id });
        setUser(nodeName);
        setShow(false);
      }}
      key={contact.key}
    >
      {nodeName}
    </ChatSubCard>
  );
};

interface ContactsProps {
  user: string;
  hide?: boolean;
  contacts: { key: string; alias: string }[];
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
            <div style={{ width: '100%' }} key={contact.key}>
              <ContactCard
                contact={contact}
                setUser={setUser}
                user={user}
                setShow={setShow}
              />
            </div>
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
