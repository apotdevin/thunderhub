import { GridWrapper } from '../components/gridWrapper/GridWrapper';
import { ForwardsList } from '../views/forwards';
import {
  ForwardChannelsReport,
  BreakdownType,
} from '../views/home/reports/forwardReport/ForwardChannelReport';
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
import { Card, CardContent } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

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
  const [breakdown, setBreakdown] = useState<BreakdownType>('incoming');

  const { data, loading } = useGetForwardsListQuery({
    variables: { days: days.value },
    onError: error => toast.error(getErrorContent(error)),
  });

  const amountForwards = useMemo(() => {
    if (loading || !data?.getForwards.list.length) return 0;
    return data.getForwards.list.length;
  }, [data, loading]);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold">Forwards</h2>

        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-2">
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
          <div className="flex gap-2">
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
      </div>

      {view === 'byChannel' && (
        <SelectWithValue
          callback={e => setChannel((e[0] || emptyChannel) as any)}
          options={
            channelOptions ? [emptyChannel, ...channelOptions] : [emptyChannel]
          }
          value={channel}
          isClearable={false}
        />
      )}

      {view === 'list' && (
        <Card>
          <CardContent>
            <ForwardsList days={days.value} />
          </CardContent>
        </Card>
      )}

      {view === 'graph' && (
        <>
          <Card>
            <CardContent>
              <ForwardResume type={type} />
            </CardContent>
          </Card>

          <Card>
            <CardContent>
              <ForwardsGraph days={days} type={type} />
            </CardContent>
          </Card>

          {amountForwards > 0 && (
            <>
              <div className="flex items-center gap-2 justify-end">
                <ToggleGroup
                  type="single"
                  variant="outline"
                  size="sm"
                  value={breakdown}
                  onValueChange={v => v && setBreakdown(v as BreakdownType)}
                >
                  <ToggleGroupItem value="incoming">Incoming</ToggleGroupItem>
                  <ToggleGroupItem value="outgoing">Outgoing</ToggleGroupItem>
                  <ToggleGroupItem value="route">Route</ToggleGroupItem>
                </ToggleGroup>
              </div>

              <Card>
                <CardContent>
                  <ForwardChannelsReport days={days.value} type={breakdown} />
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <h4 className="text-sm font-medium mb-3">
                    Grouped by Channel
                  </h4>
                  <ForwardTable days={days.value} />
                </CardContent>
              </Card>

              <Card>
                <CardContent>
                  <h4 className="text-sm font-medium mb-3">Sankey</h4>
                  <ForwardSankey days={days.value} type={type.value} />
                </CardContent>
              </Card>
            </>
          )}
        </>
      )}

      {view === 'byChannel' && (
        <Card>
          <CardContent>
            <ChannelCart channelId={channel.value} days={days.value} />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

const ForwardsPage = () => (
  <GridWrapper centerContent={false}>
    <ForwardsView />
  </GridWrapper>
);

export default ForwardsPage;
