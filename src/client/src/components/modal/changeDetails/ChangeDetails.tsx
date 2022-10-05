import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useUpdateFeesMutation } from '../../../../src/graphql/mutations/__generated__/updateFees.generated';
import { getErrorContent } from '../../../../src/utils/error';
import { InputWithDeco } from '../../../../src/components/input/InputWithDeco';
import { ColorButton } from '../../../../src/components/buttons/colorButton/ColorButton';
import { Input } from '../../../../src/components/input';
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
      data.updateFees
        ? toast.success('Channel policy updated')
        : toast.error('Error updating channel policy');
    },
    refetchQueries: ['GetChannels', 'ChannelFees'],
  });

  return (
    <>
      <SingleLine>
        <SubTitle>{'Update Channel Policy'}</SubTitle>
        <Sub4Title>{`${name} [${id}]`}</Sub4Title>
      </SingleLine>
      <InputWithDeco
        title={'Base Fee'}
        customAmount={`${newBaseFee} sats`}
        noInput={true}
      >
        <Input
          maxWidth={'160px'}
          placeholder={'sats'}
          withMargin={'0 0 0 8px'}
          mobileMargin={'0'}
          type={'number'}
          onChange={e => setBaseFee(Number(e.target.value))}
          value={newBaseFee || undefined}
        />
      </InputWithDeco>
      <InputWithDeco
        title={'Fee Rate'}
        customAmount={`${feeRatePercent}%`}
        noInput={true}
      >
        <Input
          maxWidth={'160px'}
          placeholder={'ppm'}
          withMargin={'0 0 0 8px'}
          mobileMargin={'0'}
          type={'number'}
          onChange={e => setFeeRate(Number(e.target.value))}
          value={newFeeRate || undefined}
        />
      </InputWithDeco>
      <InputWithDeco
        title={'CLTV Delta'}
        value={newCLTV}
        placeholder={'cltv delta'}
        customAmount={newCLTV?.toString() || ''}
        inputType={'number'}
        inputCallback={value => setCLTV(Number(value))}
        inputMaxWidth={'160px'}
      />
      <InputWithDeco
        title={'Max HTLC'}
        value={newMax}
        placeholder={'sats'}
        amount={newMax}
        override={'sat'}
        inputType={'number'}
        inputCallback={value => setMax(Number(value))}
        inputMaxWidth={'160px'}
      />
      <InputWithDeco
        title={'Min HTLC'}
        value={newMin}
        placeholder={'sats'}
        amount={newMin}
        override={'sat'}
        inputType={'number'}
        inputCallback={value => setMin(Number(value))}
        inputMaxWidth={'160px'}
      />
      <ColorButton
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
        fullWidth={true}
        withMargin={'16px 0 0'}
      >
        Update Channel Details
      </ColorButton>
    </>
  );
};
