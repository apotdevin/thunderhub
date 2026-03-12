import { shorten } from '@/components/generic/helpers';
import { useGetChannelsWithPeersQuery } from '@/graphql/queries/__generated__/getChannels.generated';
import { Loader2 } from 'lucide-react';
import { Select, ValueProp } from '..';
import { Channel } from '../../../graphql/types';

type ChannelSelectProps = {
  title: string;
  maxWidth?: string;
  callback: (peer: Channel[]) => void;
};

export const ChannelSelect = ({
  title,
  maxWidth,
  callback,
}: ChannelSelectProps) => {
  const { data, loading } = useGetChannelsWithPeersQuery();

  const channels = data?.getChannels || [];

  const options = channels
    .map(channel => {
      if (!channel?.partner_public_key) {
        return null;
      }

      const label = `${channel.id}
       ${
         channel?.partner_node_info?.node?.alias
           ? ` - ${channel.partner_node_info.node.alias}`
           : ''
       } -
       ${shorten(channel.partner_public_key)}`;

      return {
        value: channel.partner_public_key,
        label,
      };
    })
    .filter(Boolean) as ValueProp[];

  const handleChange = (value: ValueProp[]) => {
    const finalPeers = value
      .map(v => {
        const peer = channels.find(p => p?.partner_public_key === v.value);
        return peer?.id ? peer : null;
      })
      .filter(Boolean);
    if (finalPeers.length) {
      callback(finalPeers as Channel[]);
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
        <Select
          maxWidth={maxWidth || '500px'}
          options={options}
          callback={handleChange}
        />
      )}
    </div>
  );
};
