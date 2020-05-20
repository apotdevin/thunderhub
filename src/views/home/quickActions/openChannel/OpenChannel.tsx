import React, { useState, useEffect } from 'react';
import { ChevronRight } from 'react-feather';
import { toast } from 'react-toastify';
import { useOpenChannelMutation } from 'src/graphql/mutations/__generated__/openChannel.generated';
import { InputWithDeco } from 'src/components/input/InputWithDeco';
import { Card, Separation } from '../../../../components/generic/Styled';
import { getErrorContent } from '../../../../utils/error';
import { useBitcoinState } from '../../../../context/BitcoinContext';
import { SecureButton } from '../../../../components/buttons/secureButton/SecureButton';
import { Input } from '../../../../components/input/Input';
import {
  SingleButton,
  MultiButton,
} from '../../../../components/buttons/multiButton/MultiButton';

interface OpenChannelProps {
  color: string;
  setOpenCard: (card: string) => void;
}

export const OpenChannelCard = ({ color, setOpenCard }: OpenChannelProps) => {
  const { fast, halfHour, hour, dontShow } = useBitcoinState();
  const [size, setSize] = useState(0);
  const [fee, setFee] = useState(0);
  const [publicKey, setPublicKey] = useState('');
  const [privateChannel, setPrivateChannel] = useState(false);
  const [type, setType] = useState(dontShow ? 'fee' : 'none');

  const [openChannel] = useOpenChannelMutation({
    onError: error => toast.error(getErrorContent(error)),
    onCompleted: () => {
      toast.success('Channel Opened');
      setOpenCard('none');
    },
    refetchQueries: ['GetChannels', 'GetPendingChannels'],
  });

  const canOpen = publicKey !== '' && size > 0 && fee > 0;

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

  return (
    <Card bottom={'20px'}>
      <InputWithDeco
        color={color}
        title={'Node Public Key'}
        placeholder={'Public Key'}
        inputCallback={value => setPublicKey(value)}
      />
      <InputWithDeco
        color={color}
        title={'Channel Size'}
        placeholder={'Sats'}
        amount={size}
        inputType={'number'}
        inputCallback={value => setSize(Number(value))}
      />
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
      {!dontShow && (
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
              () => setType('fee'),
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
            color={color}
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
      <SecureButton
        fullWidth={true}
        callback={openChannel}
        variables={{
          amount: size,
          partnerPublicKey: publicKey,
          tokensPerVByte: fee,
          isPrivate: privateChannel,
        }}
        color={color}
        disabled={!canOpen}
      >
        Open Channel
        <ChevronRight size={18} />
      </SecureButton>
    </Card>
  );
};
