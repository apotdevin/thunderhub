import { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';
import { renderLine } from '../../components/generic/helpers';
import {
  DarkSubTitle,
  Separation,
  SubTitle,
} from '../../components/generic/Styled';
import { Input } from '@/components/ui/input';
import { Price } from '../../components/price/Price';
import { useConfigState } from '../../context/ConfigContext';
import { useClaimBoltzTransactionMutation } from '../../graphql/mutations/__generated__/claimBoltzTransaction.generated';
import { useBitcoinFees } from '../../hooks/UseBitcoinFees';
import { useChartColors } from '../../lib/chart-colors';
import { getErrorContent } from '../../utils/error';
import { useSwapsDispatch, useSwapsState } from './SwapContext';
import { MEMPOOL } from './SwapStatus';

export const SwapClaim = () => {
  const chartColors = useChartColors();
  const { fetchFees } = useConfigState();
  const { fast, halfHour, hour, minimum, dontShow } = useBitcoinFees();

  const [fee, setFee] = useState<number>(0);
  const [type, setType] = useState('fee');

  const { swaps, claim, claimType } = useSwapsState();
  const dispatch = useSwapsDispatch();

  const [claimTransaction, { data, loading }] =
    useClaimBoltzTransactionMutation({
      onError: error => toast.error(getErrorContent(error)),
    });

  useEffect(() => {
    if (!data?.claimBoltzTransaction || typeof claim !== 'number') return;
    dispatch({
      type: 'complete',
      index: claim,
      transactionId: data.claimBoltzTransaction,
    });
    toast.success('Transaction Claimed');
  }, [data, dispatch, claim]);

  const Missing = () => (
    <>
      <DarkSubTitle>
        Missing information to claim transaction. Please try again.
      </DarkSubTitle>
    </>
  );

  if (typeof claim !== 'number') {
    return <Missing />;
  }

  const claimingSwap = swaps[claim];
  const {
    redeemScript,
    preimage,
    receivingAddress,
    privateKey,
    id,
    lockupAddress,
  } = claimingSwap;

  if (!preimage || !lockupAddress || !privateKey) {
    return <Missing />;
  }

  const renderButton = (
    onClick: () => void,
    text: string,
    selected: boolean
  ) => (
    <Button
      variant={selected ? 'default' : 'ghost'}
      onClick={() => onClick()}
      className={cn('grow', !selected && 'text-foreground')}
    >
      {text}
    </Button>
  );

  return (
    <>
      <SubTitle>Claim the Transaction</SubTitle>
      {claimType === MEMPOOL && (
        <>
          <Separation />
          <div
            className="border rounded-lg p-1 px-2 text-center text-sm"
            style={{
              borderColor: chartColors.darkyellow,
              backgroundColor: 'rgba(255, 193, 10, 0.1)',
            }}
          >
            This will be an instant swap. This means that the locking
            transaction from Boltz has still not been confirmed in the
            blockchain.
          </div>
        </>
      )}
      <Separation />
      {fetchFees && !dontShow && (
        <div className="flex items-center w-full my-2 flex-col md:flex-row justify-between">
          <div className="flex text-sm whitespace-nowrap flex-wrap md:my-0 my-2">
            <span>Fee</span>
          </div>
          <div className="flex justify-center items-center rounded-md p-1 bg-secondary flex-wrap">
            {renderButton(
              () => {
                setType('none');
                setFee(fast);
              },
              'Auto',
              type === 'none'
            )}
            {renderButton(
              () => {
                setFee(0);
                setType('fee');
              },
              'Fee (Sats/Byte)',
              type === 'fee'
            )}
          </div>
        </div>
      )}
      <div className="flex items-center w-full my-2 flex-col md:flex-row justify-between">
        <div className="flex text-sm whitespace-nowrap flex-wrap md:my-0 my-2">
          <span>Fee Amount</span>
          <span className="text-muted-foreground mx-2 ml-4">
            <Price amount={fee * 111} />
          </span>
        </div>
        {type !== 'none' && (
          <Input
            className="ml-0 md:ml-2"
            style={{ maxWidth: '240px' }}
            placeholder={'Sats/Byte'}
            type={'number'}
            onChange={e => setFee(Number(e.target.value))}
          />
        )}
        {type === 'none' && (
          <div className="flex justify-center items-center rounded-md p-1 bg-secondary flex-wrap">
            {renderButton(
              () => setFee(fast),
              `Fastest (${fast} sats)`,
              fee === fast
            )}
            {halfHour !== fast &&
              renderButton(
                () => setFee(halfHour),
                `Half Hour (${halfHour} sats)`,
                fee === halfHour
              )}
            {renderButton(
              () => setFee(hour),
              `Hour (${hour} sats)`,
              fee === hour
            )}
          </div>
        )}
      </div>
      {!dontShow && renderLine('Minimum', `${minimum} sat/vByte`)}
      <DarkSubTitle
        className="w-full text-center"
        style={{ color: chartColors.orange }}
      >
        {
          'If you set a low fee the swap will take more time if the mempool is congested.'
        }
      </DarkSubTitle>
      <DarkSubTitle
        className="w-full text-center"
        style={{ color: chartColors.orange }}
      >
        {' You can see fee estimates by selecting the "Auto" option above.'}
      </DarkSubTitle>
      <Button
        variant="outline"
        disabled={loading || !fee || fee <= 0}
        className="w-full"
        style={{ margin: '16px 0 0' }}
        onClick={() =>
          claimTransaction({
            variables: {
              id,
              redeem: redeemScript,
              lockupAddress,
              preimage,
              privateKey,
              destination: receivingAddress,
              fee,
            },
          })
        }
      >
        {loading ? <Loader2 className="animate-spin" size={16} /> : <>Claim</>}
      </Button>
    </>
  );
};
