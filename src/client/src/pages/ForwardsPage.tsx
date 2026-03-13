import { GridWrapper } from '../components/gridWrapper/GridWrapper';
import { ForwardsList } from '../views/forwards';
import { ForwardChannelsReport } from '../views/home/reports/forwardReport/ForwardChannelReport';
import { useMemo, useState } from 'react';
import { ForwardTable } from '../views/forwards/ForwardTable';
import { options, typeOptions } from '../views/home/reports/forwardReport';
import { ForwardsGraph } from '../views/home/reports/forwardReport/ForwardsGraph';
import { SelectWithValue } from '../components/select';
import { ForwardResume } from '../views/home/reports/forwardReport/ForwardResume';
import { ForwardSankey } from '../views/forwards/forwardSankey';
import { ChannelCart } from '../components/chart/ChannelChart';
import { useGetChannelsQuery } from '../graphql/queries/__generated__/getChannels.generated';
import { useGetForwardsListQuery } from '../graphql/queries/__generated__/getForwards.generated';
import toast from 'react-hot-toast';
import { getErrorContent } from '../utils/error';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { Separator } from '@/components/ui/separator';

const emptyChannel = { label: 'All channels', value: '' };

const ForwardsView = () => {
  const [days, setDays] = useState(options[0]);
  const [type, setType] = useState(typeOptions[0]);
  const [view, setView] = useState('graph');
  const channelOptions = useGetChannelsQuery().data?.getChannels.map(it => ({
    label: `${it.id}, ${it.partner_node_info.node ? it.partner_node_info.node.alias : ''}`,
    value: it.id,
  }));
  const [channel, setChannel] = useState(emptyChannel);

  const { data, loading } = useGetForwardsListQuery({
    variables: { days: days.value },
    onError: error => toast.error(getErrorContent(error)),
  });

  const amountForwards = useMemo(() => {
    if (loading || !data?.getForwards.list.length) return 0;
    return data.getForwards.list.length;
  }, [data, loading]);

  return (
    <Card>
      <CardHeader className="border-b">
        <div className="flex flex-col gap-3 w-full">
          <div className="flex items-center justify-between">
            <CardTitle>Forwards</CardTitle>
          </div>
          <div className="flex flex-col sm:flex-row gap-2">
            <ToggleGroup
              type="single"
              variant="outline"
              size="sm"
              value={view}
              onValueChange={v => v && setView(v)}
            >
              <ToggleGroupItem value="graph">Graph</ToggleGroupItem>
              <ToggleGroupItem value="list">List</ToggleGroupItem>
              <ToggleGroupItem value="byChannel">By Channel</ToggleGroupItem>
            </ToggleGroup>
            <div className="flex gap-2 sm:ml-auto">
              <SelectWithValue
                callback={e => setDays((e[0] || options[1]) as any)}
                options={options}
                value={days}
                isClearable={false}
                maxWidth={'85px'}
              />
              {view !== 'byChannel' && (
                <SelectWithValue
                  callback={e => setType((e[0] || typeOptions[1]) as any)}
                  options={typeOptions}
                  value={type}
                  isClearable={false}
                  maxWidth={'110px'}
                />
              )}
            </div>
          </div>
          {view === 'byChannel' && (
            <SelectWithValue
              callback={e => setChannel((e[0] || emptyChannel) as any)}
              options={
                channelOptions
                  ? [emptyChannel, ...channelOptions]
                  : [emptyChannel]
              }
              value={channel}
              isClearable={false}
            />
          )}
        </div>
      </CardHeader>
      <CardContent>
        {view === 'list' && <ForwardsList days={days.value} />}
        {view === 'graph' && (
          <div className="flex flex-col gap-6">
            <ForwardResume type={type} />
            <Separator />
            <ForwardsGraph days={days} type={type} />
            {amountForwards > 0 && (
              <>
                <Separator />
                <ForwardChannelsReport days={days.value} />
                <Separator />
                <div>
                  <h4 className="text-sm font-medium mb-3">
                    Grouped by Channel
                  </h4>
                  <ForwardTable days={days.value} />
                </div>
                <Separator />
                <div>
                  <h4 className="text-sm font-medium mb-3">Sankey</h4>
                  <ForwardSankey days={days.value} type={type.value} />
                </div>
              </>
            )}
          </div>
        )}
        {view === 'byChannel' && (
          <ChannelCart channelId={channel.value} days={days.value} />
        )}
      </CardContent>
    </Card>
  );
};

const ForwardsPage = () => (
  <GridWrapper>
    <ForwardsView />
  </GridWrapper>
);

export default ForwardsPage;
