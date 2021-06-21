import { InputWithDeco } from 'src/components/input/InputWithDeco';
import {
  MultiButton,
  SingleButton,
} from 'src/components/buttons/multiButton/MultiButton';
import {
  Card,
  DarkSubTitle,
  Separation,
  SingleLine,
  SubTitle,
} from 'src/components/generic/Styled';
import { useEffect, useState } from 'react';
import { Slider } from 'src/components/slider';
import { Edit2, X } from 'react-feather';
import { ColorButton } from 'src/components/buttons/colorButton/ColorButton';
import styled from 'styled-components';
import { mediaWidths } from 'src/styles/Themes';
import { Input } from 'src/components/input';
import { useCreateBoltzReverseSwapMutation } from 'src/graphql/mutations/__generated__/createBoltzReverseSwap.generated';
import { toast } from 'react-toastify';
import { getErrorContent } from 'src/utils/error';
import { useMutationResultWithReset } from 'src/hooks/UseMutationWithReset';
import { saveToPc } from 'src/utils/helpers';
import { useSwapsDispatch } from './SwapContext';

type StartSwapProps = {
  max: number;
  min: number;
};

const StyledRow = styled.div`
  display: flex;
  width: 100%;
  justify-content: flex-end;

  @media (${mediaWidths.mobile}) {
    justify-content: center;
  }
`;

export const StartSwap = ({ max, min }: StartSwapProps) => {
  const [amount, setAmount] = useState<number>(min);
  const [isCustom, setIsCustom] = useState<boolean>(false);
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const [address, setAddress] = useState<string>();

  const [download, setDownload] = useState<boolean>(true);

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
    download &&
      saveToPc(
        JSON.stringify(data.createBoltzReverseSwap),
        `Swap-${data.createBoltzReverseSwap.id}`,
        false,
        true
      );
    resetMutation();
  }, [data, dispatch, resetMutation, download]);

  return (
    <Card mobileCardPadding={'0'} mobileNoBackground={true}>
      <SingleLine>
        <SubTitle>Start Swap</SubTitle>
        <DarkSubTitle>Lightning BTC to BTC</DarkSubTitle>
      </SingleLine>
      <InputWithDeco title={'Amount'} noInput={true} amount={amount}>
        <StyledRow>
          {isEdit ? (
            <Input
              maxWidth={'440px'}
              value={amount}
              type={'number'}
              placeholder={'Satoshis'}
              onChange={value => setAmount(Number(value.target.value))}
            />
          ) : (
            <Slider
              maxWidth={'440px'}
              value={amount}
              max={max}
              min={min}
              onChange={value => setAmount(value)}
            />
          )}

          <ColorButton
            withMargin={'0 0 0 8px'}
            onClick={() => setIsEdit(p => !p)}
            selected={isEdit}
          >
            {!isEdit ? <Edit2 size={18} /> : <X size={18} />}
          </ColorButton>
        </StyledRow>
      </InputWithDeco>
      <InputWithDeco title={'Address'} noInput={true}>
        <MultiButton>
          <SingleButton
            selected={!isCustom}
            onClick={() => {
              setIsCustom(false);
              setAddress('');
            }}
          >
            Auto
          </SingleButton>
          <SingleButton selected={isCustom} onClick={() => setIsCustom(true)}>
            Custom
          </SingleButton>
        </MultiButton>
      </InputWithDeco>
      {isCustom && (
        <InputWithDeco
          title={'Send to'}
          placeholder={'Bitcoin address'}
          value={address}
          inputCallback={value => setAddress(value)}
        />
      )}
      <Separation />
      <InputWithDeco title={'Download Backup'} noInput={true}>
        <MultiButton>
          <SingleButton selected={download} onClick={() => setDownload(true)}>
            Yes
          </SingleButton>
          <SingleButton selected={!download} onClick={() => setDownload(false)}>
            No
          </SingleButton>
        </MultiButton>
      </InputWithDeco>
      <ColorButton
        disabled={!amount || loading}
        loading={loading}
        onClick={() =>
          getQuote({ variables: { amount, ...(address && { address }) } })
        }
        arrow={true}
        withMargin={'16px 0 0'}
        fullWidth={true}
      >
        Get Quote
      </ColorButton>
    </Card>
  );
};
