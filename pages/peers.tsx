import React, { useState } from 'react';
import { useAccountState } from 'src/context/AccountContext';
import { useGetPeersQuery } from 'src/graphql/queries/__generated__/getPeers.generated';
import {
  CardWithTitle,
  SubTitle,
  Card,
} from '../src/components/generic/Styled';
import { PeersCard } from '../src/views/peers/PeersCard';
import { LoadingCard } from '../src/components/loading/LoadingCard';
import { AddPeer } from '../src/views/peers/AddPeer';

const PeersView = () => {
  const [indexOpen, setIndexOpen] = useState(0);
  const { auth } = useAccountState();

  const { loading, data } = useGetPeersQuery({
    skip: !auth,
    variables: { auth },
  });

  if (loading || !data || !data.getPeers) {
    return <LoadingCard title={'Peers'} />;
  }

  return (
    <>
      <AddPeer />
      <CardWithTitle>
        <SubTitle>Peers</SubTitle>
        <Card>
          {data.getPeers.map((peer: any, index: number) => (
            <PeersCard
              peer={peer}
              index={index + 1}
              setIndexOpen={setIndexOpen}
              indexOpen={indexOpen}
              key={`${index}-${peer.public_key}`}
            />
          ))}
        </Card>
      </CardWithTitle>
    </>
  );
};

export default PeersView;
