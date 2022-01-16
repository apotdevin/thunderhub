import * as React from 'react';
import { BaseNode } from '../../../../graphql/types';
import { useGetNodeQuery } from '../../../../graphql/queries/__generated__/getNode.generated';
import { LoadingCard } from '../../../../components/loading/LoadingCard';
import {
  DarkSubTitle,
  Separation,
  Sub4Title,
} from '../../../../components/generic/Styled';
import {
  renderLine,
  getNodeLink,
} from '../../../../components/generic/helpers';
import { useGetPeersQuery } from '../../../../graphql/queries/__generated__/getPeers.generated';
import { useAddPeerMutation } from '../../../../graphql/mutations/__generated__/addPeer.generated';
import { toast } from 'react-toastify';
import { getErrorContent } from '../../../../utils/error';
import { ColorButton } from '../../../../components/buttons/colorButton/ColorButton';
import { OpenChannelCard } from './OpenChannel';

type OpenProps = {
  partner: BaseNode;
  setOpenCard: (card: string) => void;
};

export const OpenRecommended = ({ partner, setOpenCard }: OpenProps) => {
  const [alreadyConnected, setConnected] = React.useState(false);

  const { data, loading } = useGetNodeQuery({
    variables: { publicKey: partner.public_key || '' },
  });

  const { data: peerData, loading: peerLoading } = useGetPeersQuery();

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

  if (!data?.getNode?.node?.alias) {
    return <DarkSubTitle>This node was not found.</DarkSubTitle>;
  }

  if (!alreadyConnected) {
    return (
      <>
        {renderLine('Open with', data.getNode.node?.alias)}
        {renderLine('Node Public Key', getNodeLink(partner.public_key))}
        <Separation />
        <Sub4Title>You need to connect first to this node.</Sub4Title>
        <ColorButton
          withMargin={'16px 0 0'}
          onClick={() =>
            addPeer({
              variables: {
                publicKey: partner.public_key,
                socket: partner.socket,
              },
            })
          }
          loading={addLoading}
          disabled={addLoading}
          fullWidth={true}
        >
          Connect
        </ColorButton>
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
