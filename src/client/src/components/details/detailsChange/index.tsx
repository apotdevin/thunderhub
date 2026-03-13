import { useState } from 'react';
import toast from 'react-hot-toast';
import { ChevronRight } from 'lucide-react';
import { useUpdateFeesMutation } from '@/graphql/mutations/__generated__/updateFees.generated';
import { Input } from '@/components/ui/input';
import { Price } from '@/components/price/Price';
import { Button } from '@/components/ui/button';
import { getErrorContent } from '@/utils/error';

type DetailsChangeProps = {
  callback?: () => void;
};

export const DetailsChange = ({ callback }: DetailsChangeProps) => {
  const [baseFee, setBaseFee] = useState(0);
  const [feeRate, setFeeRate] = useState(0);
  const [cltv, setCLTV] = useState(0);
  const [max, setMax] = useState(0);
  const [min, setMin] = useState(0);
  const [baseFeeDirty, setBaseFeeDirty] = useState(false);
  const [confirming, setConfirming] = useState(false);

  const [updateFees] = useUpdateFeesMutation({
    onError: error => toast.error(getErrorContent(error)),
    onCompleted: data => {
      setBaseFee(0);
      setFeeRate(0);
      setCLTV(0);
      setMax(0);
      setMin(0);
      if (data.updateFees) {
        toast.success('Channel Details Updated');
      } else {
        toast.error('Error updating fees');
      }
      if (callback) callback();
    },
    refetchQueries: ['GetChannels', 'ChannelFees'],
  });

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-muted-foreground">
          Base Fee{' '}
          {baseFeeDirty && (
            <span className="text-foreground">{baseFee} sats</span>
          )}
        </label>
        <Input
          placeholder="sats"
          type="number"
          onChange={e => {
            setBaseFeeDirty(true);
            setBaseFee(Number(e.target.value));
          }}
          value={baseFee || ''}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-muted-foreground">
          Fee Rate{' '}
          <span className="text-foreground">
            <Price amount={feeRate} override={'ppm'} />
          </span>
        </label>
        <Input
          placeholder="ppm"
          type="number"
          value={feeRate && feeRate > 0 ? feeRate : ''}
          onChange={e => setFeeRate(Number(e.target.value))}
        />
      </div>
      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-muted-foreground">
          CLTV Delta{' '}
          {cltv ? <span className="text-foreground">{cltv}</span> : null}
        </label>
        <Input
          placeholder="cltv delta"
          type="number"
          value={cltv && cltv > 0 ? cltv : ''}
          onChange={e => setCLTV(Number(e.target.value))}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-muted-foreground">
            Max HTLC{' '}
            <span className="text-foreground">
              <Price amount={max} override={'sat'} />
            </span>
          </label>
          <Input
            placeholder="sats"
            type="number"
            value={max && max > 0 ? max : ''}
            onChange={e => setMax(Number(e.target.value))}
          />
        </div>
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-muted-foreground">
            Min HTLC{' '}
            <span className="text-foreground">
              <Price amount={min} override={'sat'} />
            </span>
          </label>
          <Input
            placeholder="sats"
            type="number"
            value={min && min > 0 ? min : ''}
            onChange={e => setMin(Number(e.target.value))}
          />
        </div>
      </div>

      {confirming ? (
        <div className="mt-1 flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setConfirming(false)}
          >
            Cancel
          </Button>
          <Button
            variant="default"
            className="flex-1"
            onClick={() =>
              updateFees({
                variables: {
                  ...(baseFee >= 0 &&
                    baseFeeDirty && { base_fee_tokens: baseFee }),
                  ...(feeRate !== 0 && { fee_rate: feeRate }),
                  ...(cltv !== 0 && { cltv_delta: cltv }),
                  ...(max !== 0 && {
                    max_htlc_mtokens: (max * 1000).toString(),
                  }),
                  ...(min !== 0 && {
                    min_htlc_mtokens: (min * 1000).toString(),
                  }),
                },
              })
            }
          >
            Confirm Update
          </Button>
        </div>
      ) : (
        <Button
          variant="outline"
          disabled={
            baseFee < 0 && feeRate === 0 && cltv === 0 && max === 0 && min === 0
          }
          className="mt-1 w-full"
          onClick={() => setConfirming(true)}
        >
          Update All Channels
          <ChevronRight size={18} />
        </Button>
      )}
    </div>
  );
};
