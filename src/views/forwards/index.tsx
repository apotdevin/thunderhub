import { FC, useState } from 'react';
import { toast } from 'react-toastify';
import { LoadingCard } from 'src/components/loading/LoadingCard';
import { useGetForwardsPastDaysQuery } from 'src/graphql/queries/__generated__/getForwardsPastDays.generated';
import { Forward } from 'src/graphql/types';
import { getErrorContent } from 'src/utils/error';
import { ForwardCard } from './ForwardsCard';

type ForwardProps = {
  days: number;
};

export const ForwardsList: FC<ForwardProps> = ({ days }) => {
  const [indexOpen, setIndexOpen] = useState<number>(0);

  const { loading, data } = useGetForwardsPastDaysQuery({
    variables: { days },
    onError: error => toast.error(getErrorContent(error)),
  });

  if (loading) {
    return <LoadingCard noCard={true} />;
  }

  if (!data?.getForwardsPastDays?.length) {
    return (
      <p>{`Your node has not forwarded any payments in the past ${days} ${
        days > 1 ? 'days' : 'day'
      }.`}</p>
    );
  }

  return (
    <>
      {data?.getForwardsPastDays?.map((forward, index) => (
        <ForwardCard
          forward={forward as Forward}
          key={index}
          index={index + 1}
          setIndexOpen={setIndexOpen}
          indexOpen={indexOpen}
        />
      ))}
    </>
  );
};
