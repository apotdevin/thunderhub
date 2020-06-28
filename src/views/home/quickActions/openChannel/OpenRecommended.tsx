import * as React from 'react';
import { BaseNodesType } from 'src/graphql/types';
import { useGetNodeQuery } from 'src/graphql/queries/__generated__/getNode.generated';
import { useAccountState } from 'src/context/AccountContext';
import { LoadingCard } from 'src/components/loading/LoadingCard';
import { DarkSubTitle, Separation } from 'src/components/generic/Styled';
import { renderLine, getNodeLink } from 'src/components/generic/helpers';
import { OpenChannelCard } from './OpenChannel';

type OpenProps = {
  partner: BaseNodesType;
  setOpenCard: (card: string) => void;
};

export const OpenRecommended = ({ partner, setOpenCard }: OpenProps) => {
  const { auth } = useAccountState();

  const { data, loading } = useGetNodeQuery({
    variables: { auth, publicKey: partner.public_key },
  });

  if (loading || !data?.getNode) {
    return <LoadingCard noCard={true} />;
  }

  if (!data?.getNode?.node?.capacity) {
    return <DarkSubTitle>This node was not found.</DarkSubTitle>;
  }

  console.log({ data, loading });

  return (
    <>
      {renderLine('Open with', data.getNode.node?.alias)}
      {renderLine('Node Public Key', getNodeLink(partner.public_key))}
      <Separation />
      <OpenChannelCard
        initialPublicKey={partner.public_key}
        setOpenCard={setOpenCard}
      />
    </>
  );
};
