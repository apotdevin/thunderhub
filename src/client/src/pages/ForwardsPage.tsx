import { GridWrapper } from '../components/gridWrapper/GridWrapper';
import { ForwardsList } from '../views/forwards';
import { ForwardChannelsReport } from '../views/home/reports/forwardReport/ForwardChannelReport';
import { useMemo, useState } from 'react';
import { ForwardTable } from '../views/forwards/ForwardTable';
import { options, typeOptions } from '../views/home/reports/forwardReport';
import { ForwardsGraph } from '../views/home/reports/forwardReport/ForwardsGraph';
import styled from 'styled-components';
import { SelectWithValue } from '../components/select';
import { ForwardResume } from '../views/home/reports/forwardReport/ForwardResume';
import {
  SubTitle,
  Card,
  CardWithTitle,
  CardTitle,
} from '../components/generic/Styled';
import { ForwardSankey } from '../views/forwards/forwardSankey';
import { ChannelCart } from '../components/chart/ChannelChart';
import { useGetChannelsQuery } from '../graphql/queries/__generated__/getChannels.generated';
import { useGetForwardsListQuery } from '../graphql/queries/__generated__/getForwards.generated';
import { toast } from 'react-toastify';
import { getErrorContent } from '../utils/error';

const S = {
  header: styled.div`
    margin: 0 0 8px;
    width: 100%;
    display: flex;
  `,
  options: styled.div`
    display: flex;
    flex-grow: 1;
    gap: 8px;
    justify-content: flex-end;
  `,
};

const viewOptions = [
  { label: 'Graph', value: 'graph' },
  { label: 'List', value: 'list' },
  { label: 'By Channel', value: 'byChannel' },
];
const emptyChannel = { label: 'All channels', value: '' };

const ForwardsView = () => {
  const [days, setDays] = useState(options[0]);
  const [type, setType] = useState(typeOptions[0]);
  const [view, setView] = useState(viewOptions[0]);
  const channelOptions = useGetChannelsQuery().data?.getChannels.map(it => {
    return {
      label: `${it.id}, ${
        it.partner_node_info.node ? it.partner_node_info.node.alias : ''
      }`,
      value: it.id,
    };
  });
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
    <>
      <CardWithTitle>
        <CardTitle>
          <S.header>
            <SubTitle>Forwards</SubTitle>
            <S.options>
              <SelectWithValue
                callback={e => setView((e[0] || viewOptions[0]) as any)}
                options={viewOptions}
                value={view}
                isClearable={false}
                maxWidth={'140px'}
              />
              <SelectWithValue
                callback={e => setDays((e[0] || options[1]) as any)}
                options={options}
                value={days}
                isClearable={false}
                maxWidth={'85px'}
              />
              {view.value != 'byChannel' ? (
                <SelectWithValue
                  callback={e => setType((e[0] || typeOptions[1]) as any)}
                  options={typeOptions}
                  value={type}
                  isClearable={false}
                  maxWidth={'110px'}
                />
              ) : (
                <SelectWithValue
                  callback={e => setChannel((e[0] || emptyChannel) as any)}
                  options={
                    channelOptions
                      ? [emptyChannel, ...channelOptions]
                      : [emptyChannel]
                  }
                  value={channel}
                  isClearable={false}
                  maxWidth={'340px'}
                  minWidth={'250px'}
                />
              )}
            </S.options>
          </S.header>
        </CardTitle>
        {view.value === 'list' && (
          <Card mobileCardPadding={'0'} mobileNoBackground={true}>
            <ForwardsList days={days.value} />
          </Card>
        )}
        {view.value === 'graph' && (
          <>
            <Card mobileCardPadding={'0'} mobileNoBackground={true}>
              <ForwardResume type={type} />
            </Card>
            <Card>
              <ForwardsGraph days={days} type={type} />
            </Card>
            {amountForwards ? (
              <>
                <Card>
                  <ForwardChannelsReport days={days.value} />
                </Card>
                <SubTitle>Grouped by Channel</SubTitle>
                <Card>
                  <ForwardTable days={days.value} />
                </Card>
                <SubTitle>Sankey</SubTitle>
                <Card>
                  <ForwardSankey days={days.value} type={type.value} />
                </Card>
              </>
            ) : null}
          </>
        )}
        {view.value === 'byChannel' && (
          <>
            <ChannelCart channelId={channel.value} days={days.value} />
          </>
        )}
      </CardWithTitle>
    </>
  );
};

const ForwardsPage = () => (
  <GridWrapper>
    <ForwardsView />
  </GridWrapper>
);

export default ForwardsPage;
