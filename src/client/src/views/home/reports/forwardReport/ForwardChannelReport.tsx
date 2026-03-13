import { useState } from 'react';
import toast from 'react-hot-toast';
import { GitCommit, ArrowDown, ArrowUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useGetForwardsQuery } from '../../../../graphql/queries/__generated__/getForwards.generated';
import { getErrorContent } from '../../../../utils/error';
import { SingleLine, SubTitle } from '../../../../components/generic/Styled';
import { LoadingCard } from '../../../../components/loading/LoadingCard';
import { ChannelTable, RouteTable } from './ForwardReportTables';
import { CardContentLayout } from '.';

type Props = {
  days: number;
};

export const ForwardChannelsReport = ({ days }: Props) => {
  const [type, setType] = useState<'route' | 'incoming' | 'outgoing'>('route');

  const { data, loading } = useGetForwardsQuery({
    variables: { days },
    onError: error => toast.error(getErrorContent(error)),
  });

  if (loading) {
    return <LoadingCard noCard={true} title={'Forward Report'} />;
  }

  if (!data?.getForwards.list.length) {
    return null;
  }

  const renderContent = () => {
    if (loading || !data?.getForwards.list.length) return null;
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

  const renderTop = (title: string) => (
    <div className="mb-4">
      <SingleLine>
        <SubTitle>{title}</SubTitle>
        <div className="flex justify-center items-center rounded-md p-1 bg-secondary flex-wrap">
          <Button
            variant={type === 'incoming' ? 'default' : 'ghost'}
            onClick={() => setType('incoming')}
            className={cn('grow', type !== 'incoming' && 'text-foreground')}
          >
            <ArrowDown size={14} />
          </Button>
          <Button
            variant={type === 'route' ? 'default' : 'ghost'}
            onClick={() => setType('route')}
            className={cn('grow', type !== 'route' && 'text-foreground')}
          >
            <GitCommit size={14} />
          </Button>
          <Button
            variant={type === 'outgoing' ? 'default' : 'ghost'}
            onClick={() => setType('outgoing')}
            className={cn('grow', type !== 'outgoing' && 'text-foreground')}
          >
            <ArrowUp size={14} />
          </Button>
        </div>
      </SingleLine>
    </div>
  );

  const renderTitle = () => {
    switch (type) {
      case 'route':
        return renderTop('Routes');
      case 'incoming':
        return renderTop('Incoming');
      default:
        return renderTop('Outgoing');
    }
  };

  return (
    <CardContentLayout>
      {renderTitle()}
      {renderContent()}
    </CardContentLayout>
  );
};
