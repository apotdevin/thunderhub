import { FC, useState, useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import { useMutation } from '@apollo/client';
import { ChangeDetails } from '../../../components/modal/changeDetails/ChangeDetails';
import { useGetChannelInfoQuery } from '../../../graphql/queries/__generated__/getChannel.generated';
import { SET_CHANNEL_NOTE } from '../../../graphql/mutations/setChannelNote';

export const ChannelDetails: FC<{
  id?: string;
  name?: string;
  initialNote?: string;
  onNoteSaved?: () => void;
}> = ({ id = '', name = '', initialNote = '', onNoteSaved }) => {
  const { data, loading, error } = useGetChannelInfoQuery({
    variables: { id },
    skip: !id,
  });

  const [note, setNote] = useState(initialNote);
  const [setChannelNote, { loading: savingNote }] = useMutation(SET_CHANNEL_NOTE);

  useEffect(() => {
    setNote(initialNote);
  }, [initialNote]);

  const saveNote = async () => {
    try {
      await setChannelNote({ variables: { channelId: id, note } });
      onNoteSaved?.();
    } catch {
      // DB not configured — silently skip
    }
  };

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
    <div>
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
      <div className="mt-4 pt-4 border-t border-border">
        <p className="text-xs font-medium text-muted-foreground mb-2">
          Channel Note
        </p>
        <div className="flex gap-2">
          <input
            className="flex-1 text-sm border border-input rounded-md px-3 py-1.5 bg-background focus:outline-none focus:ring-1 focus:ring-ring"
            value={note}
            onChange={e => setNote(e.target.value)}
            placeholder="Personal note for this channel..."
            onKeyDown={e => { if (e.key === 'Enter') saveNote(); }}
          />
          <button
            disabled={savingNote}
            className="px-3 py-1.5 rounded-md bg-primary text-primary-foreground text-sm hover:bg-primary/90 disabled:opacity-50"
            onClick={saveNote}
          >
            Save
          </button>
        </div>
      </div>
    </div>
  );
};
