import { useState } from 'react';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { useUpdateFeesMutation } from '@/graphql/mutations/__generated__/updateFees.generated';
import { getErrorContent } from '@/utils/error';
import { Input } from '@/components/ui/input';
import { Price } from '@/components/price/Price';
import { Button } from '@/components/ui/button';

type ChangeDetailsType = {
  id?: string;
  name?: string;
  transaction_id?: string;
  transaction_vout?: number;
  base_fee_mtokens?: string | null;
  max_htlc_mtokens?: string | null;
  min_htlc_mtokens?: string | null;
  fee_rate?: number | null;
  cltv_delta?: number | null;
};

export const ChangeDetails = ({
  id,
  name,
  transaction_id,
  transaction_vout,
  base_fee_mtokens,
  max_htlc_mtokens,
  min_htlc_mtokens,
  fee_rate,
  cltv_delta,
}: ChangeDetailsType) => {
  const base_fee = Number(base_fee_mtokens) / 1000;
  const max_htlc = Number(max_htlc_mtokens) / 1000;
  const min_htlc = Number(min_htlc_mtokens) / 1000;

  const [newBaseFee, setBaseFee] = useState(base_fee);
  const [newFeeRate, setFeeRate] = useState(fee_rate);
  const [newCLTV, setCLTV] = useState(cltv_delta);
  const [newMax, setMax] = useState(max_htlc);
  const [newMin, setMin] = useState(min_htlc);
  const [confirming, setConfirming] = useState(false);

  const withChanges =
    newBaseFee !== base_fee ||
    newFeeRate !== fee_rate ||
    newCLTV !== cltv_delta ||
    newMax !== max_htlc ||
    newMin !== min_htlc;

  const feeRatePercent =
    Math.round(((newFeeRate || 0) / 1000000) * 100000) / 1000;

  const [updateFees, { loading }] = useUpdateFeesMutation({
    onError: error => {
      toast.error(getErrorContent(error));
      setConfirming(false);
    },
    onCompleted: data => {
      setConfirming(false);
      if (data.updateFees) {
        toast.success('Channel policy updated');
      } else {
        toast.error('Error updating channel policy');
      }
    },
    refetchQueries: ['GetChannels', 'ChannelFees'],
  });

  const handleUpdate = () => {
    updateFees({
      variables: {
        transaction_id,
        transaction_vout,
        ...((newBaseFee ?? -1) >= 0 && {
          base_fee_tokens: newBaseFee,
        }),
        ...((newFeeRate ?? -1) >= 0 && {
          fee_rate: newFeeRate,
        }),
        ...(newCLTV !== 0 && { cltv_delta: newCLTV }),
        ...(newMax !== 0 && {
          max_htlc_mtokens: (newMax * 1000).toString(),
        }),
        ...(newMin !== 0 && {
          min_htlc_mtokens: (newMin * 1000).toString(),
        }),
      },
    });
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Update Channel Policy</span>
        <span className="text-xs text-muted-foreground">
          {name} [{id}]
        </span>
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-muted-foreground">
          Base Fee <span className="text-foreground">{newBaseFee} sats</span>
        </label>
        <Input
          placeholder="sats"
          type="number"
          onChange={e => setBaseFee(Number(e.target.value))}
          value={newBaseFee || ''}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-muted-foreground">
          Fee Rate{' '}
          <span className="text-foreground">
            {newFeeRate} ppm ({feeRatePercent}%)
          </span>
        </label>
        <Input
          placeholder="ppm"
          type="number"
          onChange={e => setFeeRate(Number(e.target.value))}
          value={newFeeRate || ''}
        />
      </div>

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-muted-foreground">
          CLTV Delta{' '}
          {newCLTV ? <span className="text-foreground">{newCLTV}</span> : null}
        </label>
        <Input
          placeholder="cltv delta"
          type="number"
          value={newCLTV != null && newCLTV > 0 ? newCLTV : ''}
          onChange={e => setCLTV(Number(e.target.value))}
        />
      </div>

      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-muted-foreground">
            Max HTLC{' '}
            <span className="text-foreground">
              <Price amount={newMax} override={'sat'} />
            </span>
          </label>
          <Input
            placeholder="sats"
            type="number"
            value={newMax && newMax > 0 ? newMax : ''}
            onChange={e => setMax(Number(e.target.value))}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-muted-foreground">
            Min HTLC{' '}
            <span className="text-foreground">
              <Price amount={newMin} override={'sat'} />
            </span>
          </label>
          <Input
            placeholder="sats"
            type="number"
            value={newMin && newMin > 0 ? newMin : ''}
            onChange={e => setMin(Number(e.target.value))}
          />
        </div>
      </div>

      {confirming ? (
        <div className="mt-1 flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            disabled={loading}
            onClick={() => setConfirming(false)}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            className="flex-1"
            disabled={loading}
            onClick={handleUpdate}
          >
            {loading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              'Confirm Update'
            )}
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          disabled={!withChanges}
          className="mt-1 w-full"
          onClick={() => setConfirming(true)}
        >
          Update Channel Policy
        </Button>
      )}
    </div>
  );
};
