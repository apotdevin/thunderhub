import { useMemo } from 'react';
import toast from 'react-hot-toast';
import { useGetForwardsChannelsQuery } from '../../../../graphql/queries/__generated__/getForwards.generated';
import { getErrorContent } from '../../../../utils/error';
import { LoadingCard } from '../../../../components/loading/LoadingCard';
import { ChannelTable, RouteTable } from './ForwardReportTables';

export type BreakdownType = 'route' | 'incoming' | 'outgoing';

type Props = {
  days: number;
  type: BreakdownType;
};

export const ForwardChannelsReport = ({ days, type }: Props) => {
  const { data, loading } = useGetForwardsChannelsQuery({
    variables: { days },
    onError: error => toast.error(getErrorContent(error)),
  });

  const { by_channel, by_incoming, by_outgoing, by_route } =
    data?.getForwards || {};

  const channelMap = useMemo(() => {
    const map = new Map<
      string,
      { alias?: string | null; public_key?: string | null }
    >();
    for (const c of by_channel || []) {
      if (c.channel && c.channel_info?.node2_info) {
        map.set(c.channel, c.channel_info.node2_info);
      }
    }
    return map;
  }, [by_channel]);

  if (loading) {
    return <LoadingCard noCard={true} title={'Forward Report'} />;
  }

  if (!by_route?.length && !by_incoming?.length) {
    return (
      <div className="text-sm text-muted-foreground text-center py-4">
        No forwards for this period.
      </div>
    );
  }

  switch (type) {
    case 'route':
      return <RouteTable forwardArray={by_route} channelMap={channelMap} />;
    case 'incoming':
      return (
        <ChannelTable forwardArray={by_incoming} channelMap={channelMap} />
      );
    case 'outgoing':
      return (
        <ChannelTable forwardArray={by_outgoing} channelMap={channelMap} />
      );
    default:
      return null;
  }
};
