import { GridWrapper } from 'src/components/gridWrapper/GridWrapper';
import { NextPageContext } from 'next';
import { getProps } from 'src/utils/ssr';
import { ForwardsList } from 'src/views/forwards/index';
import { ForwardChannelsReport } from 'src/views/home/reports/forwardReport/ForwardChannelReport';
import { useState } from 'react';
import { ForwardChord } from 'src/views/forwards/forwardChord';
import { ForwardTable } from 'src/views/forwards/ForwardTable';
import { options, typeOptions } from 'src/views/home/reports/forwardReport';
import { ForwardsGraph } from 'src/views/home/reports/forwardReport/ForwardsGraph';
import styled from 'styled-components';
import { SelectWithValue } from 'src/components/select';
import { ForwardResume } from 'src/views/home/reports/forwardReport/ForwardResume';
import {
  SubTitle,
  Card,
  CardWithTitle,
  CardTitle,
  Separation,
} from '../src/components/generic/Styled';

const S = {
  options: styled.div`
    margin: 0 0 8px;
    width: 100%;
    display: grid;
    grid-gap: 8px;
    grid-template-columns: 1fr 100px 80px 110px;
  `,
};

const viewOptions = [
  { label: 'Graph', value: 'graph' },
  { label: 'List', value: 'list' },
];

const ForwardsView = () => {
  const [days, setDays] = useState(options[2]);
  const [type, setType] = useState(typeOptions[0]);
  const [view, setView] = useState(viewOptions[0]);

  return (
    <>
      <CardWithTitle>
        <CardTitle>
          <S.options>
            <SubTitle>Forwards</SubTitle>
            <SelectWithValue
              callback={e => setView((e[0] || viewOptions[0]) as any)}
              options={viewOptions}
              value={view}
              isClearable={false}
              maxWidth={'100px'}
            />
            <SelectWithValue
              callback={e => setDays((e[0] || options[1]) as any)}
              options={options}
              value={days}
              isClearable={false}
              maxWidth={'80px'}
            />
            <SelectWithValue
              callback={e => setType((e[0] || typeOptions[1]) as any)}
              options={typeOptions}
              value={type}
              isClearable={false}
              maxWidth={'110px'}
            />
          </S.options>
        </CardTitle>
        {view.value === 'list' ? (
          <Card mobileCardPadding={'0'} mobileNoBackground={true}>
            <ForwardsList days={days.value} />
          </Card>
        ) : (
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
            <SubTitle>Chord Graph</SubTitle>
            <Card>
              <ForwardChord days={days.value} order={type.value} />
            </Card>
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
