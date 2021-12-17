import React, { useState } from 'react';
import { useGetPeersQuery } from '../src/graphql/queries/__generated__/getPeers.generated';
import { GridWrapper } from '../src/components/gridWrapper/GridWrapper';
import { NextPageContext } from 'next';
import { getProps } from '../src/utils/ssr';
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

  const { loading, data } = useGetPeersQuery();

  if (loading || !data?.getPeers) {
    return <LoadingCard title={'Peers'} />;
  }

  return (
    <>
      <AddPeer />
      <CardWithTitle>
        <SubTitle>Peers</SubTitle>
        <Card mobileCardPadding={'0'} mobileNoBackground={true}>
          {data.getPeers.map((peer, index: number) => (
            <PeersCard
              peer={peer}
              index={index + 1}
              setIndexOpen={setIndexOpen}
              indexOpen={indexOpen}
              key={`${index}-${peer?.public_key}`}
            />
          ))}
        </Card>
      </CardWithTitle>
    </>
  );
};

const Wrapped = () => (
  <GridWrapper>
    <PeersView />
  </GridWrapper>
);

export default Wrapped;

export async function getServerSideProps(context: NextPageContext) {
  return await getProps(context);
}
