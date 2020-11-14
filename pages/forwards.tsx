import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { GridWrapper } from 'src/components/gridWrapper/GridWrapper';
import { Forward } from 'src/graphql/types';
import { NextPageContext } from 'next';
import { getProps } from 'src/utils/ssr';
import { useGetForwardsPastDaysQuery } from 'src/graphql/queries/__generated__/getForwardsPastDays.generated';
import {
  MultiButton,
  SingleButton,
} from 'src/components/buttons/multiButton/MultiButton';
import {
  SubTitle,
  Card,
  CardWithTitle,
  CardTitle,
} from '../src/components/generic/Styled';
import { getErrorContent } from '../src/utils/error';
import { LoadingCard } from '../src/components/loading/LoadingCard';
import { ForwardCard } from '../src/views/forwards/ForwardsCard';
import { ForwardBox } from '../src/views/home/reports/forwardReport';

const ForwardsView = () => {
  const [time, setTime] = useState<number>(30);
  const [indexOpen, setIndexOpen] = useState(0);

  const { loading, data } = useGetForwardsPastDaysQuery({
    variables: { days: time },
    onError: error => toast.error(getErrorContent(error)),
  });

  if (loading || !data || !data.getForwardsPastDays) {
    return (
      <>
        <ForwardBox />
        <LoadingCard title={'Forwards'} />
      </>
    );
  }

  const renderButton = (selectedTime: number, title: string) => (
    <SingleButton
      selected={selectedTime === time}
      onClick={() => setTime(selectedTime)}
    >
      {title}
    </SingleButton>
  );

  const renderNoForwards = () => (
    <Card>
      <p>{`Your node has not forwarded any payments in the past ${time} ${
        time > 1 ? 'days' : 'day'
      }.`}</p>
    </Card>
  );

  return (
    <>
      <ForwardBox />
      <CardWithTitle>
        <CardTitle>
          <SubTitle>Forwards</SubTitle>
          <MultiButton margin={'0 0 8px'}>
            {renderButton(1, 'D')}
            {renderButton(7, '1W')}
            {renderButton(30, '1M')}
            {renderButton(90, '3M')}
          </MultiButton>
        </CardTitle>
        {data?.getForwardsPastDays?.length ? (
          <Card mobileCardPadding={'0'} mobileNoBackground={true}>
            {data?.getForwardsPastDays?.map((forward, index) => (
              <ForwardCard
                forward={forward as Forward}
                key={index}
                index={index + 1}
                setIndexOpen={setIndexOpen}
                indexOpen={indexOpen}
              />
            ))}
          </Card>
        ) : (
          renderNoForwards()
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
