import { useState } from 'react';
import toast from 'react-hot-toast';
import { ChevronRight } from 'lucide-react';
import { useUpdateFeesMutation } from '@/graphql/mutations/__generated__/updateFees.generated';
import { Input } from '@/components/ui/input';
import { Price } from '@/components/price/Price';
import { Button } from '@/components/ui/button';
import { getErrorContent } from '@/utils/error';
import { RightAlign } from '../../generic/Styled';

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
    <>
      <div className="flex items-center w-full my-2 flex-col md:flex-row justify-between">
        <div className="flex text-sm whitespace-nowrap flex-wrap md:my-0 my-2">
          <span>BaseFee</span>
          <span className="text-muted-foreground mx-2 ml-4">
            {baseFeeDirty ? `${baseFee} sats` : ''}
          </span>
        </div>
        <Input
          className="ml-0 md:ml-2"
          style={{ maxWidth: '500px' }}
          placeholder={'sats'}
          type={'number'}
          onChange={e => {
            setBaseFeeDirty(true);
            setBaseFee(Number(e.target.value));
          }}
          value={baseFee || ''}
        />
      </div>
      <div className="flex items-center w-full my-2 flex-col md:flex-row justify-between">
        <div className="flex text-sm whitespace-nowrap flex-wrap md:my-0 my-2">
          <span>Fee Rate</span>
          <span className="text-muted-foreground mx-2 ml-4">
            <Price amount={feeRate} override={'ppm'} />
          </span>
        </div>
        <Input
          className="ml-0 md:ml-2"
          style={{ maxWidth: '500px' }}
          placeholder={'ppm'}
          type={'number'}
          value={feeRate && feeRate > 0 ? feeRate : ''}
          onChange={e => setFeeRate(Number(e.target.value))}
        />
      </div>
      <div className="flex items-center w-full my-2 flex-col md:flex-row justify-between">
        <div className="flex text-sm whitespace-nowrap flex-wrap md:my-0 my-2">
          <span>CLTV Delta</span>
          <span className="text-muted-foreground mx-2 ml-4">
            {cltv ? cltv.toString() : ''}
          </span>
        </div>
        <Input
          className="ml-0 md:ml-2"
          style={{ maxWidth: '500px' }}
          placeholder={'cltv delta'}
          type={'number'}
          value={cltv && cltv > 0 ? cltv : ''}
          onChange={e => setCLTV(Number(e.target.value))}
        />
      </div>
      <div className="flex items-center w-full my-2 flex-col md:flex-row justify-between">
        <div className="flex text-sm whitespace-nowrap flex-wrap md:my-0 my-2">
          <span>Max HTLC</span>
          <span className="text-muted-foreground mx-2 ml-4">
            <Price amount={max} override={'sat'} />
          </span>
        </div>
        <Input
          className="ml-0 md:ml-2"
          style={{ maxWidth: '500px' }}
          placeholder={'sats'}
          type={'number'}
          value={max && max > 0 ? max : ''}
          onChange={e => setMax(Number(e.target.value))}
        />
      </div>
      <div className="flex items-center w-full my-2 flex-col md:flex-row justify-between">
        <div className="flex text-sm whitespace-nowrap flex-wrap md:my-0 my-2">
          <span>Min HTLC</span>
          <span className="text-muted-foreground mx-2 ml-4">
            <Price amount={min} override={'sat'} />
          </span>
        </div>
        <Input
          className="ml-0 md:ml-2"
          style={{ maxWidth: '500px' }}
          placeholder={'sats'}
          type={'number'}
          value={min && min > 0 ? min : ''}
          onChange={e => setMin(Number(e.target.value))}
        />
      </div>

      <RightAlign>
        <Button
          variant="outline"
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
          disabled={
            baseFee < 0 && feeRate === 0 && cltv === 0 && max === 0 && min === 0
          }
          className="w-full"
          style={{ margin: '16px 0 0' }}
        >
          Update All Channels
          <ChevronRight size={18} />
        </Button>
      </RightAlign>
    </>
  );
};
