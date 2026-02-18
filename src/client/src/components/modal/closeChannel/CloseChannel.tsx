import { useState } from 'react';
import { AlertTriangle } from 'lucide-react';
import styled from 'styled-components';
import toast from 'react-hot-toast';
import { useCloseChannelMutation } from '../../../../src/graphql/mutations/__generated__/closeChannel.generated';
import { useBitcoinFees } from '../../../../src/hooks/UseBitcoinFees';
import { useConfigState } from '../../../../src/context/ConfigContext';
import { renderLine } from '../../../../src/components/generic/helpers';
import { InputWithDeco } from '../../../../src/components/input/InputWithDeco';
import { chartColors } from '../../../../src/styles/Themes';
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

type CloseChannelProps = {
  channelId: string;
  channelName: string;
  callback?: () => void;
};

export const CloseChannel = ({
  channelId,
  channelName,
  callback,
}: CloseChannelProps) => {
  const { fetchFees } = useConfigState();
  const { fast, halfHour, hour, minimum, dontShow } = useBitcoinFees();

  const [isForce, setIsForce] = useState<boolean>(false);
  const [isType, setIsType] = useState<string>('fee');
  const [amount, setAmount] = useState<number | undefined>();
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);

  const [closeChannel, { loading }] = useCloseChannelMutation({
    onCompleted: () => {
      toast.success('Channel Closed');
      setIsConfirmed(false);
      callback?.();
    },
    onError: error => toast.error(getErrorContent(error)),
    refetchQueries: [
      'GetChannels',
      'GetPendingChannels',
      'GetClosedChannels',
      'GetChannelAmountInfo',
    ],
  });

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
          let details:
            | { target: number }
            | { tokens: number }
            | Record<string, unknown> =
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
        onClick={() => setIsConfirmed(false)}
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
      <ColorButton
        disabled={!amount && !isForce}
        arrow={true}
        fullWidth={true}
        withMargin={'32px 0 0'}
        withBorder={true}
        color={'red'}
        onClick={() => setIsConfirmed(true)}
      >
        Close Channel
      </ColorButton>
    </>
  );

  return isConfirmed ? renderWarning() : renderContent();
};
