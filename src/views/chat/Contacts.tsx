import * as React from 'react';
import styled from 'styled-components';
import { SubCard } from '../../components/generic/Styled';
import { useGetNodeLazyQuery } from '../../generated/graphql';
import { useAccount } from '../../context/AccountContext';
import { useChatDispatch, useChatState } from '../../context/ChatContext';

const ContactColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 30%;
`;

const StyledSubCard = styled(SubCard)`
  width: 100%;
  cursor: pointer;
`;

interface ContactsProps {
  contacts: { key: string; alias: string }[];
  setUser: (active: string) => void;
}

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
    <StyledSubCard
      onClick={() => {
        dispatch({ type: 'changeActive', sender: contact.key, userId: id });
        setUser(nodeName);
      }}
      key={contact.key}
    >
      {nodeName}
    </StyledSubCard>
  );
};

export const Contacts = ({ contacts, setUser }: ContactsProps) => {
  return (
    <ContactColumn>
      {contacts.map(contact => {
        if (contact) {
          return (
            <div style={{ width: '100%' }} key={contact.key}>
              <ContactCard contact={contact} setUser={setUser} />
            </div>
          );
        }
      })}
    </ContactColumn>
  );
};
