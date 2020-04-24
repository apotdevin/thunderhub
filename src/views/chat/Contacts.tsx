import * as React from 'react';
import styled from 'styled-components';
import { SubCard } from '../../components/generic/Styled';
import { useGetNodeLazyQuery } from '../../generated/graphql';
import { useAccount } from '../../context/AccountContext';

const ContactColumn = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: flex-start;
  width: 30%;
`;

const StyledSubCard = styled(SubCard)`
  width: 100%;
`;

interface ContactsProps {
  contacts: { key: string; alias: string }[];
  setActive: (active: string) => void;
  setUser: (active: string) => void;
}

export const ContactCard = ({
  contact,
  setActive,
  setUser,
}: {
  contact: { key: string; alias: string };
  setActive: (active: string) => void;
  setUser: (active: string) => void;
}) => {
  const [nodeName, setNodeName] = React.useState(contact.alias ?? '');
  const { auth } = useAccount();
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
      setUser(name);
    }
  }, [data, loading]);

  return (
    <StyledSubCard onClick={() => setActive(contact.key)} key={contact.key}>
      {nodeName}
    </StyledSubCard>
  );
};

export const Contacts = ({ contacts, setActive, setUser }: ContactsProps) => {
  return (
    <ContactColumn>
      {contacts.map(contact => {
        if (contact) {
          return (
            <ContactCard
              setActive={setActive}
              contact={contact}
              setUser={setUser}
            />
          );
        }
      })}
    </ContactColumn>
  );
};
