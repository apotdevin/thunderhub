import { FC } from 'react';
import { Loader2 } from 'lucide-react';
import { ChangeDetails } from '../../../components/modal/changeDetails/ChangeDetails';
import { useGetChannelInfoQuery } from '../../../graphql/queries/__generated__/getChannel.generated';

export const ChannelDetails: FC<{ id?: string; name?: string }> = ({
  id = '',
  name = '',
}) => {
  const { data, loading, error } = useGetChannelInfoQuery({
    variables: { id },
    skip: !id,
  });

  if (loading) {
    return (
      <div className="flex items-center justify-center py-4">
        <Loader2 className="animate-spin text-muted-foreground" size={16} />
      </div>
    );
  }

  if (!data?.getChannel || error) {
    return (
      <div className="py-4 text-center text-sm text-muted-foreground">
        Error getting channel information. Try refreshing the page.
      </div>
    );
  }

  const { transaction_id, transaction_vout, node_policies } = data.getChannel;

  return (
    <ChangeDetails
      id={id}
      name={name}
      transaction_id={transaction_id}
      transaction_vout={transaction_vout}
      base_fee_mtokens={node_policies?.base_fee_mtokens || '0'}
      max_htlc_mtokens={node_policies?.max_htlc_mtokens || '0'}
      min_htlc_mtokens={node_policies?.min_htlc_mtokens || '0'}
      fee_rate={node_policies?.fee_rate || 0}
      cltv_delta={node_policies?.cltv_delta || 0}
    />
  );
};
