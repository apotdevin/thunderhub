import { useState } from 'react';
import { SmallSelectWithValue } from '../../../../components/select';
import {
  CardWithTitle,
  SubTitle,
  Card,
  CardTitle,
} from '../../../../components/generic/Styled';
import { ForwardChannelsReport } from './ForwardChannelReport';
import { ForwardResume } from './ForwardResume';
import { ForwardsGraph } from './ForwardsGraph';

export const CardContent = ({
  children,
  className,
  ...props
}: React.HTMLAttributes<HTMLDivElement>) => (
  <div
    className={`h-full flex flex-col px-2 md:px-4 ${className ?? ''}`}
    {...props}
  >
    {children}
  </div>
);

export const options = [
  { label: '1D', value: 1 },
  { label: '7D', value: 7 },
  { label: '1M', value: 30 },
  { label: '2M', value: 60 },
  { label: '6M', value: 180 },
];

export const typeOptions = [
  { label: 'Count', value: 'count' },
  { label: 'Amount', value: 'tokens' },
  { label: 'Fees', value: 'fee' },
];

export const ForwardBox = () => {
  const [days, setDays] = useState(options[0]);
  const [type, setType] = useState(typeOptions[0]);

  return (
    <CardWithTitle>
      <CardTitle className="flex flex-col md:flex-row mb-2">
        <SubTitle>Forward Report</SubTitle>

        <div className="flex gap-2">
          <SmallSelectWithValue
            callback={e => setDays((e[0] || options[1]) as any)}
            options={options}
            value={days}
            isClearable={false}
          />
          <SmallSelectWithValue
            callback={e => setType((e[0] || typeOptions[1]) as any)}
            options={typeOptions}
            value={type}
            isClearable={false}
          />
        </div>
      </CardTitle>

      <Card mobileCardPadding={'8px'}>
        <ForwardResume type={type} />
      </Card>
      <Card mobileCardPadding={'8px'}>
        <ForwardsGraph days={days} type={type} />
        <ForwardChannelsReport days={days.value} />
      </Card>
    </CardWithTitle>
  );
};
