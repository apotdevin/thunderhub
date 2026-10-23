import { FC, useMemo } from 'react';
import toast from 'react-hot-toast';
import { getErrorContent } from '../../utils/error';
import { useGetForwardsChannelsQuery } from '../../graphql/queries/__generated__/getForwards.generated';
import { Sankey, SankeyData } from '../../components/sankey';
import { AggregatedRouteForwards } from '../../graphql/types';

const getValue = (item: AggregatedRouteForwards, type: string) => {
  switch (type) {
    case 'count':
      return item.count;
    case 'tokens':
      return item.tokens;
    case 'fee':
      return item.fee;
    default:
      return 0;
  }
};

export const ForwardSankey: FC<{
  days: number;
  type: string;
}> = ({ days, type }) => {
  const { data, loading } = useGetForwardsChannelsQuery({
    variables: { days },
    onError: error => toast.error(getErrorContent(error)),
  });

  const sankeyData: SankeyData = useMemo(() => {
    if (loading || !data || !data.getForwards.by_route?.length) {
      return { links: [], nodes: [] };
    }

    const channelMap = new Map<string, string>();
    for (const c of data.getForwards.by_channel || []) {
      if (c.channel && c.channel_info?.node2_info?.alias) {
        channelMap.set(c.channel, c.channel_info.node2_info.alias);
      }
    }

    const routes = data.getForwards.by_route;
    const links: { source: string; target: string; value: number }[] = [];
    const nodesSet = new Set<string>();

    for (let i = 0; i < routes.length; i++) {
      const c = routes[i];
      if (!c) continue;
      const incomingAlias = channelMap.get(c.incoming_channel) || 'Unknown';
      const outgoingAlias = channelMap.get(c.outgoing_channel) || 'Unknown';
      const source = `source: ${incomingAlias} (${c.incoming_channel})`;
      const target = `target: ${outgoingAlias} (${c.outgoing_channel})`;

      links.push({ source, target, value: getValue(c, type) });
      nodesSet.add(source);
      nodesSet.add(target);
    }

    links.sort((a, b) => b.value - a.value);

    return {
      links,
      nodes: Array.from(nodesSet).map(n => ({ name: n })),
    };
  }, [data, loading, type]);

  if (loading || !data?.getForwards.by_route.length) {
    return null;
  }

  const graphHeight = 800 + 16 * sankeyData.links.length;

  return (
    <div
      className="w-full"
      style={{ height: `${graphHeight}px`, maxHeight: `${graphHeight}px` }}
    >
      <Sankey data={sankeyData} width="100%" height={`${graphHeight}px`} />
    </div>
  );
};
