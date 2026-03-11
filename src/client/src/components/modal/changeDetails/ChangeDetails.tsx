import { useState } from 'react';
import toast from 'react-hot-toast';
import { useUpdateFeesMutation } from '@/graphql/mutations/__generated__/updateFees.generated';
import { getErrorContent } from '@/utils/error';
import { Input } from '@/components/ui/input';
import { Price } from '@/components/price/Price';
import { Button } from '@/components/ui/button';
import { SingleLine, SubTitle, Sub4Title } from '../../generic/Styled';

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

  const withChanges =
    newBaseFee !== base_fee ||
    newFeeRate !== fee_rate ||
    newCLTV !== cltv_delta ||
    newMax !== max_htlc ||
    newMin !== min_htlc;

  const feeRatePercent =
    Math.round(((newFeeRate || 0) / 1000000) * 100000) / 1000;

  const [updateFees] = useUpdateFeesMutation({
    onError: error => {
      toast.error(getErrorContent(error));
    },
    onCompleted: data => {
      if (data.updateFees) {
        toast.success('Channel policy updated');
      } else {
        toast.error('Error updating channel policy');
      }
    },
    refetchQueries: ['GetChannels', 'ChannelFees'],
  });

  return (
    <>
      <SingleLine>
        <SubTitle>{'Update Channel Policy'}</SubTitle>
        <Sub4Title>{`${name} [${id}]`}</Sub4Title>
      </SingleLine>
      <div className="flex items-center w-full my-2 flex-col md:flex-row justify-between">
        <div className="flex text-sm whitespace-nowrap flex-wrap md:my-0 my-2">
          <span>Base Fee</span>
          <span className="text-muted-foreground mx-2 ml-4">
            {`${newBaseFee} sats`}
          </span>
        </div>
        <Input
          className="ml-0 md:ml-2"
          style={{ maxWidth: '160px' }}
          placeholder={'sats'}
          type={'number'}
          onChange={e => setBaseFee(Number(e.target.value))}
          value={newBaseFee || ''}
        />
      </div>
      <div className="flex items-center w-full my-2 flex-col md:flex-row justify-between">
        <div className="flex text-sm whitespace-nowrap flex-wrap md:my-0 my-2">
          <span>Fee Rate</span>
          <span className="text-muted-foreground mx-2 ml-4">
            {`${feeRatePercent}%`}
          </span>
        </div>
        <Input
          className="ml-0 md:ml-2"
          style={{ maxWidth: '160px' }}
          placeholder={'ppm'}
          type={'number'}
          onChange={e => setFeeRate(Number(e.target.value))}
          value={newFeeRate || ''}
        />
      </div>
      <div className="flex items-center w-full my-2 flex-col md:flex-row justify-between">
        <div className="flex text-sm whitespace-nowrap flex-wrap md:my-0 my-2">
          <span>CLTV Delta</span>
          <span className="text-muted-foreground mx-2 ml-4">
            {newCLTV?.toString() || ''}
          </span>
        </div>
        <Input
          className="ml-0 md:ml-2"
          style={{ maxWidth: '160px' }}
          placeholder={'cltv delta'}
          type={'number'}
          value={newCLTV != null && newCLTV > 0 ? newCLTV : ''}
          onChange={e => setCLTV(Number(e.target.value))}
        />
      </div>
      <div className="flex items-center w-full my-2 flex-col md:flex-row justify-between">
        <div className="flex text-sm whitespace-nowrap flex-wrap md:my-0 my-2">
          <span>Max HTLC</span>
          <span className="text-muted-foreground mx-2 ml-4">
            <Price amount={newMax} override={'sat'} />
          </span>
        </div>
        <Input
          className="ml-0 md:ml-2"
          style={{ maxWidth: '160px' }}
          placeholder={'sats'}
          type={'number'}
          value={newMax && newMax > 0 ? newMax : ''}
          onChange={e => setMax(Number(e.target.value))}
        />
      </div>
      <div className="flex items-center w-full my-2 flex-col md:flex-row justify-between">
        <div className="flex text-sm whitespace-nowrap flex-wrap md:my-0 my-2">
          <span>Min HTLC</span>
          <span className="text-muted-foreground mx-2 ml-4">
            <Price amount={newMin} override={'sat'} />
          </span>
        </div>
        <Input
          className="ml-0 md:ml-2"
          style={{ maxWidth: '160px' }}
          placeholder={'sats'}
          type={'number'}
          value={newMin && newMin > 0 ? newMin : ''}
          onChange={e => setMin(Number(e.target.value))}
        />
      </div>
      <Button
        variant="outline"
        onClick={() =>
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
          })
        }
        disabled={!withChanges}
        className="w-full"
        style={{ margin: '16px 0 0' }}
      >
        Update Channel Details
      </Button>
    </>
  );
};
