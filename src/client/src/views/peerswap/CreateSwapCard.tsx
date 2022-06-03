import React, { useState } from 'react';
import { toast } from 'react-toastify';

import { ColorButton } from '../../components/buttons/colorButton/ColorButton';
import {
  MultiButton,
  SingleButton,
} from '../../components/buttons/multiButton/MultiButton';
import { InputWithDeco } from '../../components/input/InputWithDeco';
import { ChannelSelect } from '../../components/select/specific/PeerSwapChannelSelect';
import { getErrorContent } from '../../utils/error';
import { useCreatePeerSwapSwapMutation } from '../../graphql/mutations/__generated__/createPeerSwapSwap.generated';

export const CreateSwapCard = ({
  swapType,
}: {
  setOpen: () => void;
  swapType: string;
}) => {
  const [channelId, setChannel] = useState('');
  const [amount, setAmount] = useState(0);
  const [asset, setAsset] = useState('btc');
  const [createSwap, {}] = useCreatePeerSwapSwapMutation({
    onError: error => toast.error(getErrorContent(error)),
  });

  const SECTION_COLOR = '#FFD300';

  const handleEnter = () => {
    if (amount === 0 || channelId === '') return;
    createSwap({ variables: { amount, asset, channelId, type: swapType } });
  };

  return (
    <>
      <InputWithDeco
        title={'Amount'}
        value={amount}
        placeholder={'sats'}
        amount={amount}
        inputType={'number'}
        inputCallback={value => setAmount(Number(value))}
        color={SECTION_COLOR}
      />
      <ChannelSelect
        title={'Channel'}
        isMulti={false}
        maxWidth={'300px'}
        callback={setChannel}
      />
      <InputWithDeco title={'Asset Type'} noInput={true}>
        <MultiButton>
          <SingleButton
            onClick={() => setAsset('btc')}
            selected={asset === 'btc'}
          >
            btc
          </SingleButton>
          <SingleButton
            onClick={() => setAsset('lbtc')}
            selected={asset === 'lbtc'}
          >
            l-btc
          </SingleButton>
        </MultiButton>
      </InputWithDeco>
      <ColorButton
        onClick={() => handleEnter()}
        disabled={amount === 0 || channelId === ''}
        withMargin={'16px 0 0'}
        arrow={true}
        fullWidth={true}
      >
        {swapType === 'swap_in' ? 'Swap In' : 'Swap Out'}
      </ColorButton>
    </>
  );
};
