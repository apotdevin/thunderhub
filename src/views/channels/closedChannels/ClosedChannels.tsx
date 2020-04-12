import React, { useState } from 'react';
import { useQuery } from '@apollo/react-hooks';
import { GET_CLOSED_CHANNELS } from '../../../graphql/query';
import { Card } from '../../../components/generic/Styled';
import { ClosedCard } from './ClosedCard';
import { useAccount } from '../../../context/AccountContext';
import { toast } from 'react-toastify';
import { getErrorContent } from '../../../utils/error';
import { LoadingCard } from '../../../components/loading/LoadingCard';

export const ClosedChannels = () => {
  const [indexOpen, setIndexOpen] = useState(0);

  const { host, viewOnly, cert, sessionAdmin } = useAccount();
  const auth = {
    host,
    macaroon: viewOnly !== '' ? viewOnly : sessionAdmin,
    cert,
  };

  const { loading, data } = useQuery(GET_CLOSED_CHANNELS, {
    variables: { auth },
    onError: error => toast.error(getErrorContent(error)),
  });

  if (loading || !data || !data.getClosedChannels) {
    return <LoadingCard noTitle={true} />;
  }

  return (
    <Card>
      {data.getClosedChannels.map((channel: any, index: number) => (
        <ClosedCard
          channelInfo={channel}
          key={index}
          index={index + 1}
          setIndexOpen={setIndexOpen}
          indexOpen={indexOpen}
        />
      ))}
    </Card>
  );
};
