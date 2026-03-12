import { useGetPeersQuery } from '@/graphql/queries/__generated__/getPeers.generated';
import { shorten } from '@/components/generic/helpers';
import { Peer } from '@/graphql/types';
import { Loader2 } from 'lucide-react';
import { Select, ValueProp } from '..';

type PeerSelectProps = {
  title: string;
  callback: (peer: Peer[]) => void;
};

export const PeerSelect = ({ title, callback }: PeerSelectProps) => {
  const { data, loading } = useGetPeersQuery();

  const peers = data?.getPeers || [];

  const options = peers
    .map(peer => {
      if (!peer?.public_key) {
        return null;
      }
      let label = shorten(peer.public_key);

      if (
        peer.partner_node_info.node?.alias &&
        peer.partner_node_info.node?.alias !== 'Node not found'
      ) {
        label = `${peer.partner_node_info.node.alias} (${shorten(
          peer.public_key
        )})`;
      }

      return {
        value: peer.public_key,
        label,
      };
    })
    .filter(Boolean) as ValueProp[];

  const handleChange = (value: ValueProp[]) => {
    const finalPeers = value
      .map(v => {
        const peer = peers.find(p => p?.public_key === v.value);
        return peer ? peer : null;
      })
      .filter(Boolean);
    if (finalPeers.length) {
      callback(finalPeers as Peer[]);
    } else {
      callback([]);
    }
  };

  return (
    <div className="flex items-center w-full my-2 flex-col md:flex-row justify-between">
      <div className="flex text-sm whitespace-nowrap flex-wrap md:my-0 my-2">
        <span>{title}</span>
      </div>
      {loading ? (
        <Loader2 className="animate-spin text-primary" size={20} />
      ) : (
        <Select maxWidth={'500px'} options={options} callback={handleChange} />
      )}
    </div>
  );
};
