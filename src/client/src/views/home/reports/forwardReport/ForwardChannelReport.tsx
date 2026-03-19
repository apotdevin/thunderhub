import toast from 'react-hot-toast';
import { useGetForwardsQuery } from '../../../../graphql/queries/__generated__/getForwards.generated';
import { getErrorContent } from '../../../../utils/error';
import { LoadingCard } from '../../../../components/loading/LoadingCard';
import { ChannelTable, RouteTable } from './ForwardReportTables';

export type BreakdownType = 'route' | 'incoming' | 'outgoing';

type Props = {
  days: number;
  type: BreakdownType;
};

export const ForwardChannelsReport = ({ days, type }: Props) => {
  const { data, loading } = useGetForwardsQuery({
    variables: { days },
    onError: error => toast.error(getErrorContent(error)),
  });

  if (loading) {
    return <LoadingCard noCard={true} title={'Forward Report'} />;
  }

  if (!data?.getForwards.list.length) {
    return (
      <div className="text-sm text-muted-foreground text-center py-4">
        No forwards for this period.
      </div>
    );
  }

  const { by_incoming, by_outgoing, by_route } = data.getForwards;

  switch (type) {
    case 'route':
      return <RouteTable forwardArray={by_route} />;
    case 'incoming':
      return <ChannelTable forwardArray={by_incoming} />;
    case 'outgoing':
      return <ChannelTable forwardArray={by_outgoing} />;
    default:
      return null;
  }
};
