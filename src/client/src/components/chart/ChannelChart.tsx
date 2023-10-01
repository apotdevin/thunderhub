import { useGetForwardsQuery } from '../../graphql/queries/__generated__/getForwards.generated';
import { toast } from 'react-toastify';
import { getErrorContent } from '../../utils/error';

type ChannelCartProps = {
  channelId: string;
};

export const ChannelCart = ({ channelId }: ChannelCartProps) => {
  const { data, loading, error } = useGetForwardsQuery({
    variables: { days: 7 },
    onError: error => toast.error(getErrorContent(error)),
  });
  console.log(data, loading, error);

  return <div>ChannelCart id: {channelId}</div>;
};
