import { FC } from 'react';
import { Loader2 } from 'lucide-react';
import { useGetChannelQuery } from '../../../../graphql/queries/__generated__/getChannel.generated';
import { useGetClosedChannelsQuery } from '../../../../graphql/queries/__generated__/getClosedChannels.generated';

import { Tooltip as ReactTooltip } from 'react-tooltip';
import { Info } from 'lucide-react';
import { getAliasFromClosedChannels } from './helpers';

export const ChannelAlias: FC<{ id: string }> = ({ id }) => {
  const { data: closedChannelData } = useGetClosedChannelsQuery({
    skip: !id,
    errorPolicy: 'ignore',
  });

  const { data, loading } = useGetChannelQuery({
    skip: !id,
    errorPolicy: 'ignore',
    variables: { id },
  });

  if (!id) {
    return <>Unknown</>;
  }

  if (loading) {
    return <Loader2 className="animate-spin text-primary" size={8} />;
  }

  if (data?.getChannel.partner_node_policies?.node?.node?.alias) {
    return <>{data.getChannel.partner_node_policies.node.node.alias}</>;
  }

  if (closedChannelData?.getClosedChannels?.length) {
    const { alias: closedAlias, closed } = getAliasFromClosedChannels(
      id,
      closedChannelData.getClosedChannels
    );

    if (closed) {
      return (
        <>
          {closedAlias}
          <span className="ml-1">
            <Info size={16} data-tip data-for={'channel_info'} />
          </span>
          <ReactTooltip id={'channel_info'} place={'right'}>
            This channel has been closed.
          </ReactTooltip>
        </>
      );
    }

    return <>{closedAlias}</>;
  }

  return <>Unknown</>;
};
