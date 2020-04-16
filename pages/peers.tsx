import React, { useState } from 'react';
import { useAccount } from '../src/context/AccountContext';
import {
  CardWithTitle,
  SubTitle,
  Card,
} from '../src/components/generic/Styled';
import { PeersCard } from '../src/views/peers/PeersCard';
import { LoadingCard } from '../src/components/loading/LoadingCard';
import { AddPeer } from '../src/views/peers/AddPeer';
import { useGetPeersQuery } from '../src/generated/graphql';

const PeersView = () => {
  const [indexOpen, setIndexOpen] = useState(0);
  const { host, viewOnly, cert, sessionAdmin } = useAccount();
  const auth = {
    host,
    macaroon: viewOnly !== '' ? viewOnly : sessionAdmin,
    cert,
  };

  const { loading, data } = useGetPeersQuery({
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
