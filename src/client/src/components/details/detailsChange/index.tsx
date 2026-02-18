import { useState } from 'react';
import toast from 'react-hot-toast';
import { ChevronRight } from 'lucide-react';
import { useUpdateFeesMutation } from '../../../../src/graphql/mutations/__generated__/updateFees.generated';
import { Input } from '../../../../src/components/input';
import { InputWithDeco } from '../../../../src/components/input/InputWithDeco';
import { ColorButton } from '../../../../src/components/buttons/colorButton/ColorButton';
import { getErrorContent } from '../../../../src/utils/error';
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
      <InputWithDeco
        title={'BaseFee'}
        customAmount={baseFeeDirty ? `${baseFee} sats` : ''}
        noInput={true}
      >
        <Input
          placeholder={'sats'}
          maxWidth={`500px`}
          withMargin={'0 0 0 8px'}
          mobileMargin={'0'}
          type={'number'}
          onChange={e => {
            setBaseFeeDirty(true);
            setBaseFee(Number(e.target.value));
          }}
          value={baseFee || undefined}
        />
      </InputWithDeco>
      <InputWithDeco
        title={'Fee Rate'}
        value={feeRate}
        placeholder={'ppm'}
        amount={feeRate}
        override={'ppm'}
        inputType={'number'}
        inputCallback={value => setFeeRate(Number(value))}
      />
      <InputWithDeco
        title={'CLTV Delta'}
        value={cltv}
        placeholder={'cltv delta'}
        customAmount={cltv ? cltv.toString() : ''}
        inputType={'number'}
        inputCallback={value => setCLTV(Number(value))}
      />
      <InputWithDeco
        title={'Max HTLC'}
        value={max}
        placeholder={'sats'}
        amount={max}
        override={'sat'}
        inputType={'number'}
        inputCallback={value => setMax(Number(value))}
      />
      <InputWithDeco
        title={'Min HTLC'}
        value={min}
        placeholder={'sats'}
        amount={min}
        override={'sat'}
        inputType={'number'}
        inputCallback={value => setMin(Number(value))}
      />

      <RightAlign>
        <ColorButton
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
          fullWidth={true}
          withMargin={'16px 0 0'}
        >
          Update All Channels
          <ChevronRight size={18} />
        </ColorButton>
      </RightAlign>
    </>
  );
};
