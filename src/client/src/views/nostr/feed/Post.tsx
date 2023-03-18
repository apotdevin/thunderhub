import { useEffect, useState } from 'react';
import {
  Separation,
  SingleLine,
  SubCard,
  SubTitle,
} from '../../../components/generic/Styled';
import { useNostrProfileQuery } from '../../../graphql/queries/__generated__/getNostrProfile.generated';
import { NostrEvent } from '../../../graphql/types';

export const Post = ({ note }: { note: NostrEvent }) => {
  const { data } = useNostrProfileQuery({ variables: { pubkey: note.pubkey } });
  const [name, setName] = useState(null);
  useEffect(() => {
    if (!data) return;
    const content = JSON.parse(data.getNostrProfile.profile.content);
    setName(content.username);
  }, [data]);
  return (
    <SubCard>
      <SingleLine>
        <SubTitle>
          {name}@{note.pubkey}
        </SubTitle>
        <SubTitle>{note.created_at}</SubTitle>
      </SingleLine>
      <Separation />
      <SubTitle>{note.content}</SubTitle>
    </SubCard>
  );
};
