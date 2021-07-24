import React, { useState } from 'react';
import { SmallSelectWithValue } from 'src/components/select';
import styled from 'styled-components';
import {
  CardWithTitle,
  SubTitle,
  Card,
  CardTitle,
  Separation,
} from '../../../../components/generic/Styled';
import { mediaWidths } from '../../../../styles/Themes';
import { ForwardChannelsReport } from './ForwardChannelReport';
import { ForwardResume } from './ForwardResume';
import { ForwardsGraph } from './ForwardsGraph';

export const CardContent = styled.div`
  height: 100%;
  display: flex;
  flex-flow: column;
  padding: 0 16px;

  @media (${mediaWidths.mobile}) {
    padding: 0 8px;
  }
`;

const S = {
  row: styled.div`
    width: 100%;
    display: grid;
    grid-template-columns: 1fr 60px 90px;
  `,
};

export const options = [
  { label: '1D', value: 1 },
  { label: '7D', value: 7 },
  { label: '1M', value: 30 },
  { label: '2M', value: 60 },
  { label: '6M', value: 180 },
];

export const typeOptions = [
  { label: 'Amount', value: 'amount' },
  { label: 'Tokens', value: 'tokens' },
  { label: 'Fees', value: 'fee' },
];

export const ForwardBox = () => {
  const [days, setDays] = useState(options[2]);
  const [type, setType] = useState(typeOptions[0]);

  return (
    <CardWithTitle>
      <CardTitle>
        <S.row>
          <SubTitle>Forward Report</SubTitle>
          <SmallSelectWithValue
            callback={e => setDays((e[0] || options[1]) as any)}
            options={options}
            value={days}
            isClearable={false}
            maxWidth={'60px'}
          />
          <SmallSelectWithValue
            callback={e => setType((e[0] || typeOptions[1]) as any)}
            options={typeOptions}
            value={type}
            isClearable={false}
            maxWidth={'90px'}
          />
        </S.row>
      </CardTitle>
      <Card mobileCardPadding={'8px'}>
        <ForwardsGraph days={days} type={type} />
        <Separation />
        <ForwardResume type={type} />
        <Separation />
        <ForwardChannelsReport days={days.value} order={type.value} />
      </Card>
    </CardWithTitle>
  );
};
