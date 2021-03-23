import { FC, useState } from 'react';
import { toast } from 'react-toastify';
import { LoadingCard } from 'src/components/loading/LoadingCard';
import { useGetForwardsQuery } from 'src/graphql/queries/__generated__/getForwards.generated';
import { Forward } from 'src/graphql/types';
import { getErrorContent } from 'src/utils/error';
import { ForwardCard } from './ForwardsCard';

type ForwardProps = {
  days: number;
};

export const ForwardsList: FC<ForwardProps> = ({ days }) => {
  const [indexOpen, setIndexOpen] = useState<number>(0);

  const { loading, data } = useGetForwardsQuery({
    variables: { days },
    onError: error => toast.error(getErrorContent(error)),
  });

  if (loading) {
    return <LoadingCard noCard={true} />;
  }

  if (!data?.getForwards?.length) {
    return (
      <p>{`Your node has not forwarded any payments in the past ${days} ${
        days > 1 ? 'days' : 'day'
      }.`}</p>
    );
  }

  return (
    <>
      {data?.getForwards?.map((forward, index) => (
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
