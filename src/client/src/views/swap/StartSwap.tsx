import { cn } from '@/lib/utils';
import {
  Card,
  DarkSubTitle,
  SingleLine,
  SubTitle,
} from '../../components/generic/Styled';
import { useEffect, useState } from 'react';
import { Slider } from '../../components/slider';
import { Edit2, X, ChevronRight, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useCreateBoltzReverseSwapMutation } from '../../graphql/mutations/__generated__/createBoltzReverseSwap.generated';
import toast from 'react-hot-toast';
import { Price } from '../../components/price/Price';
import { getErrorContent } from '../../utils/error';
import { useMutationResultWithReset } from '../../hooks/UseMutationWithReset';
import { useSwapsDispatch } from './SwapContext';

type StartSwapProps = {
  max: number;
  min: number;
};

export const StartSwap = ({ max, min }: StartSwapProps) => {
  const [amount, setAmount] = useState<number>(min);
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [address, setAddress] = useState<string>();

  const dispatch = useSwapsDispatch();

  const [getQuote, { data: _data, loading }] =
    useCreateBoltzReverseSwapMutation({
      onError: error => toast.error(getErrorContent(error)),
    });
  const [data, resetMutation] = useMutationResultWithReset(_data);

  useEffect(() => {
    if (!data?.createBoltzReverseSwap) return;
    dispatch({
      type: 'add',
      swap: data.createBoltzReverseSwap,
    });

    resetMutation();
  }, [data, dispatch, resetMutation]);

  return (
    <Card mobileCardPadding={'0'} mobileNoBackground={true}>
      <SingleLine>
        <SubTitle>Start Swap</SubTitle>
        <DarkSubTitle>Lightning BTC to BTC</DarkSubTitle>
      </SingleLine>
      <div className="flex items-center w-full my-2 flex-col md:flex-row justify-between">
        <div className="flex text-sm whitespace-nowrap flex-wrap md:my-0 my-2">
          <span>Amount</span>
          <span className="text-muted-foreground mx-2 ml-4">
            <Price amount={amount} />
          </span>
        </div>
        <div className="flex w-full justify-center md:justify-end">
          {isEdit ? (
            <Input
              className="ml-0 md:ml-2"
              style={{ maxWidth: '440px' }}
              value={amount}
              type={'number'}
              placeholder={'Satoshis'}
              onChange={value => setAmount(Number(value.target.value))}
            />
          ) : (
            <Slider
              value={amount}
              max={max}
              min={min}
              onChange={value => setAmount(value)}
            />
          )}

          <Button
            variant={isEdit ? 'default' : 'outline'}
            style={{ margin: '0 0 0 8px' }}
            onClick={() => setIsEdit(p => !p)}
          >
            {!isEdit ? <Edit2 size={18} /> : <X size={18} />}
          </Button>
        </div>
      </div>
      <div className="flex items-center w-full my-2 flex-col md:flex-row justify-between">
        <div className="flex text-sm whitespace-nowrap flex-wrap md:my-0 my-2">
          <span>Address</span>
        </div>
        <div className="flex justify-center items-center rounded-md p-1 bg-secondary flex-wrap">
          <Button
            variant={!isCustom ? 'default' : 'ghost'}
            onClick={() => {
              setIsCustom(false);
              setAddress('');
            }}
            className={cn('grow', isCustom && 'text-foreground')}
          >
            Auto
          </Button>
          <Button
            variant={isCustom ? 'default' : 'ghost'}
            onClick={() => setIsCustom(true)}
            className={cn('grow', !isCustom && 'text-foreground')}
          >
            Custom
          </Button>
        </div>
      </div>
      {isCustom && (
        <div className="flex items-center w-full my-2 flex-col md:flex-row justify-between">
          <div className="flex text-sm whitespace-nowrap flex-wrap md:my-0 my-2">
            <span>Send to</span>
          </div>
          <Input
            className="ml-0 md:ml-2"
            style={{ maxWidth: '500px' }}
            placeholder={'Bitcoin address'}
            value={address ?? ''}
            onChange={e => setAddress(e.target.value)}
          />
        </div>
      )}

      <Button
        variant="outline"
        disabled={!amount || loading}
        onClick={() =>
          getQuote({ variables: { amount, ...(address && { address }) } })
        }
        style={{ margin: '16px 0 0' }}
        className="w-full"
      >
        {loading ? (
          <Loader2 className="animate-spin" size={16} />
        ) : (
          <>
            Get Quote <ChevronRight size={18} />
          </>
        )}
      </Button>
    </Card>
  );
};
