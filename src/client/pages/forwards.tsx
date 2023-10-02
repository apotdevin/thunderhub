import { GridWrapper } from '../src/components/gridWrapper/GridWrapper';
import { NextPageContext } from 'next';
import { getProps } from '../src/utils/ssr';
import { ForwardsList } from '../src/views/forwards/index';
import { ForwardChannelsReport } from '../src/views/home/reports/forwardReport/ForwardChannelReport';
import { useState } from 'react';
import { ForwardTable } from '../src/views/forwards/ForwardTable';
import { options, typeOptions } from '../src/views/home/reports/forwardReport';
import { ForwardsGraph } from '../src/views/home/reports/forwardReport/ForwardsGraph';
import styled from 'styled-components';
import { SelectWithValue } from '../src/components/select';
import { ForwardResume } from '../src/views/home/reports/forwardReport/ForwardResume';
import {
  SubTitle,
  Card,
  CardWithTitle,
  CardTitle,
  Separation,
} from '../src/components/generic/Styled';
import { ForwardSankey } from '../src/views/forwards/forwardSankey';
import { ChannelCart } from '../src/components/chart/ChannelChart';

const S = {
  options: styled.div`
    margin: 0 0 8px;
    width: 100%;
    display: flex;
    justify-content: space-between;
  `,
  temp: styled.div`
    display: flex;
    gap: 8px;
    width: 40%;
    justify-content: flex-end;
  `,
};

const viewOptions = [
  { label: 'Graph', value: 'graph' },
  { label: 'List', value: 'list' },
  { label: 'By Channel', value: 'byChannel' },
];

const ForwardsView = () => {
  const [days, setDays] = useState(options[0]);
  const [type, setType] = useState(typeOptions[0]);
  const [view, setView] = useState(viewOptions[0]);
  // todo channels dropdown,
  //  show it if  viewOption == byChannel

  return (
    <>
      <CardWithTitle>
        <CardTitle>
          <S.options>
            <SubTitle>Forwards</SubTitle>
            <S.temp>
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
                maxWidth={'80px'}
              />
              {view.value != 'byChannel' && (
                <SelectWithValue
                  callback={e => setType((e[0] || typeOptions[1]) as any)}
                  options={typeOptions}
                  value={type}
                  isClearable={false}
                  maxWidth={'110px'}
                />
              )}
            </S.temp>
          </S.options>
        </CardTitle>
        {view.value === 'list' && (
          <Card mobileCardPadding={'0'} mobileNoBackground={true}>
            <ForwardsList days={days.value} />
          </Card>
        )}
        {view.value === 'graph' && (
          <>
            <Card mobileCardPadding={'0'} mobileNoBackground={true}>
              <ForwardsGraph days={days} type={type} />
              <Separation />
              <ForwardResume type={type} />
              <Separation />
              <ForwardChannelsReport days={days.value} order={type.value} />
            </Card>
            <SubTitle>Grouped by Channel</SubTitle>
            <Card>
              <ForwardTable days={days.value} order={type.value} />
            </Card>
            <SubTitle>Sankey</SubTitle>
            <Card>
              <ForwardSankey
                days={days.value}
                type={type.value as 'amount' | 'fee' | 'tokens'}
              />
            </Card>
          </>
        )}
        {view.value === 'byChannel' && (
          <>
            <ChannelCart channelId={'asd'} days={days.value} />
          </>
        )}
      </CardWithTitle>
    </>
  );
};

const Wrapped = () => (
  <GridWrapper>
    <ForwardsView />
  </GridWrapper>
);

export default Wrapped;

export async function getServerSideProps(context: NextPageContext) {
  return await getProps(context);
}
