import React, { useState, useEffect } from 'react';
import {
  Card,
  SingleLine,
  Separation,
  DarkSubTitle,
  NoWrapTitle,
  ResponsiveLine,
} from '../../../../components/generic/Styled';
import { ChevronRight } from 'react-feather';
import { getErrorContent } from '../../../../utils/error';
import { toast } from 'react-toastify';
import { useBitcoinState } from '../../../../context/BitcoinContext';
import styled from 'styled-components';
import { SecureButton } from '../../../../components/buttons/secureButton/SecureButton';
import { Input } from '../../../../components/input/Input';
import {
  SingleButton,
  MultiButton,
} from '../../../../components/buttons/multiButton/MultiButton';
import { Price } from '../../../../components/price/Price';
import { mediaWidths } from '../../../../styles/Themes';
import { useOpenChannelMutation } from '../../../../generated/graphql';

const ResponsiveWrap = styled(SingleLine)`
  @media (${mediaWidths.mobile}) {
    flex-wrap: wrap;
  }
`;

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
      <ResponsiveLine>
        <NoWrapTitle>Node Public Key:</NoWrapTitle>
        <Input
          placeholder={'Public Key'}
          color={color}
          withMargin={'0 0 0 8px'}
          mobileMargin={'0'}
          onChange={e => setPublicKey(e.target.value)}
        />
      </ResponsiveLine>
      <ResponsiveLine>
        <ResponsiveWrap>
          <NoWrapTitle>Channel Size:</NoWrapTitle>
          <NoWrapTitle>
            <DarkSubTitle>
              <Price amount={size} />
            </DarkSubTitle>
          </NoWrapTitle>
        </ResponsiveWrap>
        <Input
          placeholder={'Sats'}
          color={color}
          withMargin={'0 0 0 8px'}
          mobileMargin={'0'}
          type={'number'}
          onChange={e => setSize(Number(e.target.value))}
        />
      </ResponsiveLine>
      <Separation />
      <SingleLine>
        <NoWrapTitle>Private Channel:</NoWrapTitle>
        <MultiButton margin={'8px 0 8px 16px'}>
          {renderButton(() => setPrivateChannel(true), 'Yes', privateChannel)}
          {renderButton(() => setPrivateChannel(false), 'No', !privateChannel)}
        </MultiButton>
      </SingleLine>
      <Separation />
      {!dontShow && (
        <SingleLine>
          <NoWrapTitle>Fee:</NoWrapTitle>
          <MultiButton margin={'8px 0 8px 16px'}>
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
        </SingleLine>
      )}
      <SingleLine>
        <ResponsiveWrap>
          <NoWrapTitle>Fee Amount:</NoWrapTitle>
          <DarkSubTitle>
            <Price amount={fee * 223} />
          </DarkSubTitle>
        </ResponsiveWrap>
        {type !== 'none' && (
          <Input
            withMargin={'8px 0 8px 16px'}
            placeholder={'Sats/Byte'}
            color={color}
            type={'number'}
            onChange={e => setFee(Number(e.target.value))}
          />
        )}
        {type === 'none' && (
          <MultiButton margin={'8px 0 8px 16px'}>
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
      </SingleLine>
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
