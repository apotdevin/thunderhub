import React, { useState, useEffect } from 'react';
import { AlertTriangle } from 'react-feather';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { useCloseChannelMutation } from 'src/graphql/mutations/__generated__/closeChannel.generated';
import { useBitcoinFees } from 'src/hooks/UseBitcoinFees';
import { useConfigState } from 'src/context/ConfigContext';
import { renderLine } from 'src/components/generic/helpers';
import { InputWithDeco } from 'src/components/input/InputWithDeco';
import { chartColors } from 'src/styles/Themes';
import {
  Separation,
  SingleLine,
  SubTitle,
  Sub4Title,
  DarkSubTitle,
} from '../../generic/Styled';
import { getErrorContent } from '../../../utils/error';
import { ColorButton } from '../../buttons/colorButton/ColorButton';
import {
  MultiButton,
  SingleButton,
} from '../../buttons/multiButton/MultiButton';

interface CloseChannelProps {
  callback: () => void;
  channelId: string;
  channelName: string;
}

const Warning = styled.div`
  font-size: 14px;
  color: ${chartColors.orange};
`;

const WarningCard = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
`;

const CenterLine = styled(SingleLine)`
  justify-content: center;
`;

export const CloseChannel = ({
  callback,
  channelId,
  channelName,
}: CloseChannelProps) => {
  const { fetchFees } = useConfigState();
  const { fast, halfHour, hour, minimum, dontShow } = useBitcoinFees();

  const [isForce, setIsForce] = useState<boolean>(false);
  const [isType, setIsType] = useState<string>('fee');
  const [amount, setAmount] = useState<number | undefined>();
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);

  const [closeChannel, { loading, data }] = useCloseChannelMutation({
    onError: error => toast.error(getErrorContent(error)),
    refetchQueries: [
      'GetChannels',
      'GetPendingChannels',
      'GetClosedChannels',
      'GetChannelAmountInfo',
    ],
  });

  useEffect(() => {
    if (data && data.closeChannel) {
      toast.success('Channel Closed');
      callback();
    }
  }, [data, callback]);

  const handleOnlyClose = () => callback();

  const renderButton = (
    onClick: () => void,
    text: string,
    selected: boolean
  ) => (
    <SingleButton selected={selected} onClick={onClick}>
      {text}
    </SingleButton>
  );

  const renderWarning = () => (
    <WarningCard>
      <AlertTriangle size={32} color={'red'} />
      <SubTitle>Are you sure you want to close the channel?</SubTitle>
      <Separation />
      {!isForce ? (
        <>
          {renderLine(
            'Type',
            isType === 'none' ? 'Auto' : isType === 'fee' ? 'Fee' : 'Target'
          )}
          {renderLine(
            isType !== 'target' ? 'Fee (sats/vbyte)' : 'Blocks',
            amount
          )}
        </>
      ) : (
        <DarkSubTitle>This is a force close</DarkSubTitle>
      )}
      <Separation />
      <ColorButton
        fullWidth={true}
        disabled={(loading || !amount) && !isForce}
        loading={loading}
        withMargin={'16px 4px 4px'}
        color={'red'}
        onClick={() => {
          let details: { target: number } | { tokens: number } | {} =
            isType === 'target' ? { target: amount } : { tokens: amount };

          if (isForce) {
            details = {};
          }

          closeChannel({
            variables: {
              id: channelId,
              forceClose: isForce,
              ...details,
            },
          });
        }}
      >
        {`Close Channel [ ${channelName}/${channelId} ]`}
      </ColorButton>
      <ColorButton
        fullWidth={true}
        disabled={loading}
        withMargin={'4px'}
        onClick={handleOnlyClose}
      >
        Cancel
      </ColorButton>
    </WarningCard>
  );

  const renderContent = () => (
    <>
      <SingleLine>
        <SubTitle>{'Close Channel'}</SubTitle>
        <Sub4Title>{`${channelName} [${channelId}]`}</Sub4Title>
      </SingleLine>
      <Separation />
      <SingleLine>
        <Sub4Title>Force Close Channel:</Sub4Title>
      </SingleLine>
      <MultiButton>
        {renderButton(
          () => {
            setAmount(undefined);
            setIsForce(true);
          },
          'Yes',
          isForce
        )}
        {renderButton(() => setIsForce(false), 'No', !isForce)}
      </MultiButton>
      {!isForce && (
        <>
          <SingleLine>
            <Sub4Title>Fee:</Sub4Title>
            {!dontShow && <Warning>{`Minimum: ${minimum} sats/vByte`}</Warning>}
          </SingleLine>
          <MultiButton>
            {fetchFees &&
              !dontShow &&
              renderButton(
                () => {
                  setAmount(undefined);
                  setIsType('none');
                },
                'Auto',
                isType === 'none'
              )}
            {renderButton(
              () => {
                setAmount(undefined);
                setIsType('fee');
              },
              'Fee',
              isType === 'fee'
            )}
            {renderButton(
              () => {
                setAmount(undefined);
                setIsType('target');
              },
              'Target',
              isType === 'target'
            )}
          </MultiButton>
        </>
      )}
      {isType === 'none' && !isForce && (
        <>
          <SingleLine>
            <Sub4Title>Fee Amount:</Sub4Title>
          </SingleLine>
          <MultiButton>
            {renderButton(
              () => setAmount(fast),
              `Fastest (${fast} sats)`,
              amount === fast
            )}
            {halfHour !== fast &&
              renderButton(
                () => setAmount(halfHour),
                `Half Hour (${halfHour} sats)`,
                amount === halfHour
              )}
            {renderButton(
              () => setAmount(hour),
              `Hour (${hour} sats)`,
              amount === hour
            )}
          </MultiButton>
        </>
      )}
      {isType !== 'none' && !isForce && (
        <InputWithDeco
          title={isType === 'target' ? 'Target Blocks:' : 'Fee (Sats/Byte)'}
          placeholder={isType === 'target' ? 'Blocks' : 'Sats/Byte'}
          value={amount}
          inputType={'number'}
          inputCallback={e => setAmount(Number(e))}
        />
      )}
      <Separation />
      <CenterLine>
        <ColorButton
          withMargin={'4px'}
          withBorder={true}
          onClick={handleOnlyClose}
        >
          Cancel
        </ColorButton>
        <ColorButton
          disabled={!amount && !isForce}
          arrow={true}
          withMargin={'4px'}
          withBorder={true}
          color={'red'}
          onClick={() => setIsConfirmed(true)}
        >
          Close Channel
        </ColorButton>
      </CenterLine>
    </>
  );

  return isConfirmed ? renderWarning() : renderContent();
};
