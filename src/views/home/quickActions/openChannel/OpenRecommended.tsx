import * as React from 'react';
import { BaseNodesType } from 'src/graphql/types';
import { useGetNodeQuery } from 'src/graphql/queries/__generated__/getNode.generated';
import { useAccountState } from 'src/context/AccountContext';
import { LoadingCard } from 'src/components/loading/LoadingCard';
import {
  DarkSubTitle,
  Separation,
  Sub4Title,
} from 'src/components/generic/Styled';
import { renderLine, getNodeLink } from 'src/components/generic/helpers';
import { useGetPeersQuery } from 'src/graphql/queries/__generated__/getPeers.generated';
import { useAddPeerMutation } from 'src/graphql/mutations/__generated__/addPeer.generated';
import { SecureButton } from 'src/components/buttons/secureButton/SecureButton';
import { toast } from 'react-toastify';
import { getErrorContent } from 'src/utils/error';
import { OpenChannelCard } from './OpenChannel';

type OpenProps = {
  partner: BaseNodesType;
  setOpenCard: (card: string) => void;
};

export const OpenRecommended = ({ partner, setOpenCard }: OpenProps) => {
  const [alreadyConnected, setConnected] = React.useState(false);
  const { auth } = useAccountState();

  const { data, loading } = useGetNodeQuery({
    skip: !auth,
    variables: { auth, publicKey: partner.public_key || '' },
  });

  const { data: peerData, loading: peerLoading } = useGetPeersQuery({
    skip: !auth,
    variables: { auth },
  });

  React.useEffect(() => {
    if (!peerLoading && peerData && peerData.getPeers) {
      const isPeer =
        peerData.getPeers.map(p => p?.public_key).indexOf(partner.public_key) >=
        0;

      if (isPeer) {
        setConnected(true);
      }
    }
  }, [peerLoading, peerData, partner.public_key]);

  const [addPeer, { loading: addLoading }] = useAddPeerMutation({
    refetchQueries: ['GetPeers'],
    onError: error => toast.error(getErrorContent(error)),
    onCompleted: () => setConnected(true),
  });

  if (loading || !data?.getNode || peerLoading) {
    return <LoadingCard noCard={true} />;
  }

  if (!data?.getNode?.node?.capacity) {
    return <DarkSubTitle>This node was not found.</DarkSubTitle>;
  }

  if (!alreadyConnected) {
    return (
      <>
        {renderLine('Open with', data.getNode.node?.alias)}
        {renderLine('Node Public Key', getNodeLink(partner.public_key))}
        <Separation />
        <Sub4Title>You need to connect first to this node.</Sub4Title>
        <SecureButton
          withMargin={'16px 0 0'}
          callback={addPeer}
          loading={addLoading}
          disabled={addLoading}
          variables={{ publicKey: partner.public_key, socket: partner.socket }}
          fullWidth={true}
        >
          Connect
        </SecureButton>
      </>
    );
  }

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
