import { useGetForwardsQuery } from '../../graphql/queries/__generated__/getForwards.generated';
import { toast } from 'react-toastify';
import { getErrorContent } from '../../utils/error';
type ChannelCartProps = {
  channelId: string;
  days: number;
};

/**
 * lnd currently not support filter for channelId, so now it impossible to optimize query.
 */
export const ChannelCart = ({ channelId }: ChannelCartProps) => {
  const { data } = useGetForwardsQuery({
    ssr: false,
    variables: { days: 7 }, //todo change
    onError: error => toast.error(getErrorContent(error)),
  });
  const filteredData = data?.getForwards.filter(
    it => it.incoming_channel === channelId || it.outgoing_channel === channelId
  );
  console.log('santa', data);
  console.log('santa', filteredData);

  return (
    <div>
      ChannelCart id: {channelId}
      {'filteredData'}
    </div>
  );
};
