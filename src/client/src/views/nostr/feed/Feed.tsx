import {
  Card,
  CardWithTitle,
  SubTitle,
} from '../../../components/generic/Styled';
import { useNostrState } from '../../../context/NostrContext';
import { useNostrFeedQuery } from '../../../graphql/queries/__generated__/getNostrFeed.generated';

import { Post } from './Post';

export const Feed = () => {
  const { pub } = useNostrState();
  const { data, loading } = useNostrFeedQuery({ variables: { myPubkey: pub } });
  if (!data && !loading) return <></>;
  return (
    <CardWithTitle>
      <SubTitle>Feed</SubTitle>
      <Card>
        {data &&
          data.getNostrFeed.feed.map(note => (
            <Post key={note.id} note={note} />
          ))}
      </Card>
    </CardWithTitle>
  );
};
