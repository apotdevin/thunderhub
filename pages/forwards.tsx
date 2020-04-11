import React, { useState } from 'react';
import {
  SubTitle,
  Card,
  CardWithTitle,
  CardTitle,
  ColorButton,
  SingleLine,
} from '../src/components/generic/Styled';
import { useAccount } from '../src/context/AccountContext';
import { GET_FORWARDS } from '../src/graphql/query';
import { useQuery } from '@apollo/react-hooks';
import { toast } from 'react-toastify';
import { getErrorContent } from '../src/utils/error';
import { LoadingCard } from '../src/components/loading/LoadingCard';
import { ForwardCard } from '../src/views/forwards/ForwardsCard';
import { textColorMap } from '../src/styles/Themes';
import { useSettings } from '../src/context/SettingsContext';
import { ForwardBox } from '../src/views/home/reports/forwardReport';

const timeMap: { [key: string]: string } = {
  day: 'today',
  week: 'this week',
  month: 'this month',
  threeMonths: 'these past 3 months',
};

const ForwardsView = () => {
  const [time, setTime] = useState('week');
  const [indexOpen, setIndexOpen] = useState(0);

  const { theme } = useSettings();
  const { host, viewOnly, cert, sessionAdmin } = useAccount();
  const auth = {
    host,
    macaroon: viewOnly !== '' ? viewOnly : sessionAdmin,
    cert,
  };

  const { loading, data } = useQuery(GET_FORWARDS, {
    variables: { auth, time },
    onError: error => toast.error(getErrorContent(error)),
  });

  if (loading || !data || !data.getForwards) {
    return <LoadingCard title={'Forwards'} />;
  }

  const renderButton = (selectedTime: string, title: string) => (
    <ColorButton
      color={textColorMap[theme]}
      onClick={() => setTime(selectedTime)}
      selected={time === selectedTime}
    >
      {title}
    </ColorButton>
  );

  const renderNoForwards = () => (
    <p>{`Your node has not forwarded any payments ${timeMap[time]}.`}</p>
  );

  return (
    <>
      <ForwardBox />
      <CardWithTitle>
        <CardTitle>
          <SubTitle>Forwards</SubTitle>
          <SingleLine>
            {renderButton('day', 'D')}
            {renderButton('week', '1W')}
            {renderButton('month', '1M')}
            {renderButton('threeMonths', '3M')}
          </SingleLine>
        </CardTitle>
        <Card>
          {data.getForwards.forwards.length <= 0 && renderNoForwards()}
          {data.getForwards.forwards.map((forward: any, index: number) => (
            <ForwardCard
              forward={forward}
              key={index}
              index={index + 1}
              setIndexOpen={setIndexOpen}
              indexOpen={indexOpen}
            />
          ))}
        </Card>
      </CardWithTitle>
    </>
  );
};

export default ForwardsView;
