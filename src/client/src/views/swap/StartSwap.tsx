import { useEffect, useState } from 'react';
import { Slider } from '../../components/slider';
import { Edit2, X, ChevronRight, Loader2, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useCreateBoltzReverseSwapMutation } from '../../graphql/mutations/__generated__/createBoltzReverseSwap.generated';
import toast from 'react-hot-toast';
import { Price } from '../../components/price/Price';
import { getErrorContent } from '../../utils/error';
import { useMutationResultWithReset } from '../../hooks/UseMutationWithReset';
import { useBoltzSwapActions } from '../../context/BoltzSwapContext';

type StartSwapProps = {
  max: number;
  min: number;
};

export const StartSwap = ({ max, min }: StartSwapProps) => {
  const [amount, setAmount] = useState<number>(min);
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [address, setAddress] = useState<string>();

  const actions = useBoltzSwapActions();

  const [getQuote, { data: _data, loading }] =
    useCreateBoltzReverseSwapMutation({
      onError: error => toast.error(getErrorContent(error)),
    });
  const [data, resetMutation] = useMutationResultWithReset(_data);

  useEffect(() => {
    if (!data?.createBoltzReverseSwap) return;
    const swap = data.createBoltzReverseSwap;
    actions.addSwap(swap);
    actions.openSwap(swap.id);
    resetMutation();
  }, [data, actions, resetMutation]);

  return (
    <div>
      {/* Amount */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Amount
          </label>
          <span className="text-sm font-medium tabular-nums">
            <Price amount={amount} />
          </span>
        </div>
        <div className="flex items-center gap-2">
          {isEdit ? (
            <Input
              className="flex-1"
              value={amount}
              type={'number'}
              placeholder={'Satoshis'}
              onChange={value => setAmount(Number(value.target.value))}
            />
          ) : (
            <div className="flex-1">
              <Slider
                value={amount}
                max={max}
                min={min}
                onChange={value => setAmount(value)}
              />
            </div>
          )}
          <Button
            variant={isEdit ? 'default' : 'outline'}
            size="icon"
            className="shrink-0"
            onClick={() => setIsEdit(p => !p)}
          >
            {!isEdit ? <Edit2 size={14} /> : <X size={14} />}
          </Button>
        </div>
      </div>

      {/* Separator */}
      <div className="my-5 h-px bg-border" />

      {/* Address */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
            Destination
          </label>
          <ToggleGroup
            type="single"
            variant="outline"
            size="sm"
            value={isCustom ? 'custom' : 'auto'}
            onValueChange={value => {
              if (!value) return;
              setIsCustom(value === 'custom');
              if (value === 'auto') setAddress('');
            }}
          >
            <ToggleGroupItem value="auto">Auto</ToggleGroupItem>
            <ToggleGroupItem value="custom">Custom</ToggleGroupItem>
          </ToggleGroup>
        </div>

        {isCustom && (
          <Input
            placeholder={'Enter Bitcoin address'}
            value={address ?? ''}
            onChange={e => setAddress(e.target.value)}
          />
        )}
      </div>

      {/* Submit */}
      <Button
        disabled={!amount || loading}
        onClick={() =>
          getQuote({ variables: { amount, ...(address && { address }) } })
        }
        className="w-full mt-5"
      >
        {loading ? (
          <Loader2 className="animate-spin" size={16} />
        ) : (
          <>
            <Zap size={14} className="mr-1" />
            Get Quote
            <ChevronRight size={16} className="ml-1" />
          </>
        )}
      </Button>
    </div>
  );
};
