import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'react-feather';
import { toast } from 'react-toastify';
import { useOpenChannelMutation } from 'src/graphql/mutations/__generated__/openChannel.generated';
import { InputWithDeco } from 'src/components/input/InputWithDeco';
import { ColorButton } from 'src/components/buttons/colorButton/ColorButton';
import { useBitcoinFees } from 'src/hooks/UseBitcoinFees';
import { useConfigState } from 'src/context/ConfigContext';
import { SelectWithDeco } from 'src/components/select/SelectWithDeco';
import { Separation } from '../../../../components/generic/Styled';
import { getErrorContent } from '../../../../utils/error';
import { Input } from '../../../../components/input';
import {
  SingleButton,
  MultiButton,
} from '../../../../components/buttons/multiButton/MultiButton';

interface OpenChannelProps {
  initialPublicKey?: string | undefined | null;
  setOpenCard: (card: string) => void;
}

export const OpenChannelCard = ({
  setOpenCard,
  initialPublicKey = '',
}: OpenChannelProps) => {
  const { fetchFees } = useConfigState();
  const { fast, halfHour, hour, dontShow } = useBitcoinFees();
  const [size, setSize] = useState(0);

  const [pushType, setPushType] = useState('none');
  const [pushTokens, setPushTokens] = useState(0);

  const [fee, setFee] = useState(0);
  const [publicKey, setPublicKey] = useState(initialPublicKey);
  const [privateChannel, setPrivateChannel] = useState(false);
  const [type, setType] = useState(dontShow || !fetchFees ? 'fee' : 'none');

  const [openChannel] = useOpenChannelMutation({
    onError: error => toast.error(getErrorContent(error)),
    onCompleted: () => {
      toast.success('Channel Opened');
      setOpenCard('none');
    },
    refetchQueries: ['GetChannels', 'GetPendingChannels'],
  });

  const canOpen = publicKey !== '' && size > 0 && fee > 0;

  const pushAmount =
    pushType === 'none'
      ? 0
      : pushType === 'half'
      ? size / 2
      : Math.min(pushTokens, size * 0.9);

  useEffect(() => {
    if (type === 'none' && fee === 0) {
      setFee(fast);
    }
  }, [type, fee, fast]);

  const renderButton = (
    onClick: () => void,
    text: string,
    selected: boolean
  ) => (
    <SingleButton selected={selected} onClick={onClick}>
      {text}
    </SingleButton>
  );

  const options = [
    { value: 'chocolate', label: 'Chocolate' },
    { value: 'strawberry', label: 'Strawberry' },
    { value: 'vanilla', label: 'Vanilla' },
  ];

  return (
    <>
      <SelectWithDeco
        title={'With Node'}
        options={options}
        callback={value => console.log(value)}
      />
      {!initialPublicKey && (
        <InputWithDeco
          title={'New Node'}
          value={publicKey}
          placeholder={'PublicKey@Socket'}
          inputCallback={value => setPublicKey(value)}
        />
      )}
      <InputWithDeco
        title={'Channel Size'}
        value={size}
        placeholder={'Sats'}
        amount={size}
        inputType={'number'}
        inputCallback={value => setSize(Number(value))}
      />
      <Separation />
      <InputWithDeco title={'Push Tokens to Partner'} noInput={true}>
        <MultiButton>
          {renderButton(() => setPushType('none'), 'None', pushType === 'none')}
          {renderButton(() => setPushType('half'), 'Half', pushType === 'half')}
          {renderButton(
            () => setPushType('custom'),
            'Custom',
            pushType === 'custom'
          )}
        </MultiButton>
      </InputWithDeco>
      {pushType === 'custom' && (
        <InputWithDeco
          title={'Amount'}
          value={Math.min(pushTokens, size * 0.9)}
          placeholder={`Sats (Max: ${size * 0.9} sats)`}
          amount={Math.min(pushTokens, size * 0.9)}
          inputType={'number'}
          inputCallback={value => setPushTokens(Number(value))}
        />
      )}
      <Separation />
      <InputWithDeco title={'Type'} noInput={true}>
        <MultiButton>
          {renderButton(
            () => setPrivateChannel(true),
            'Private',
            privateChannel
          )}
          {renderButton(
            () => setPrivateChannel(false),
            'Public',
            !privateChannel
          )}
        </MultiButton>
      </InputWithDeco>
      <Separation />
      {fetchFees && !dontShow && (
        <InputWithDeco title={'Fee'} noInput={true}>
          <MultiButton>
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
          </MultiButton>
        </InputWithDeco>
      )}
      <InputWithDeco title={'Fee Amount'} amount={fee * 223} noInput={true}>
        {type !== 'none' && (
          <Input
            maxWidth={'500px'}
            placeholder={'Sats/Byte'}
            type={'number'}
            onChange={e => setFee(Number(e.target.value))}
          />
        )}
        {type === 'none' && (
          <MultiButton>
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
          </MultiButton>
        )}
      </InputWithDeco>
      <Separation />
      <ColorButton
        fullWidth={true}
        onClick={() =>
          openChannel({
            variables: {
              amount: size,
              partnerPublicKey: publicKey || '',
              tokensPerVByte: fee,
              isPrivate: privateChannel,
              pushTokens: pushAmount,
            },
          })
        }
        disabled={!canOpen}
      >
        Open Channel
        <ChevronRight size={18} />
      </ColorButton>
    </>
  );
};
