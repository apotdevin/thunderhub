import { useState } from 'react';
import { AlertTriangle, ChevronRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useCloseChannelMutation } from '@/graphql/mutations/__generated__/closeChannel.generated';
import { useBitcoinFees } from '@/hooks/UseBitcoinFees';
import { useConfigState } from '@/context/ConfigContext';
import { renderLine } from '@/components/generic/helpers';
import { Input } from '@/components/ui/input';
import {
  Separation,
  SingleLine,
  SubTitle,
  Sub4Title,
  DarkSubTitle,
} from '../../generic/Styled';
import { getErrorContent } from '../../../utils/error';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';

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
    <Button
      variant={selected ? 'default' : 'ghost'}
      onClick={() => onClick()}
      className={cn('grow', !selected && 'text-foreground')}
    >
      {text}
    </Button>
  );

  const renderWarning = () => (
    <div className="flex flex-col justify-center items-center">
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
      <Button
        variant="destructive"
        className="w-full"
        disabled={(loading || !amount) && !isForce}
        style={{ margin: '16px 4px 4px' }}
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
        {loading ? (
          <Loader2 className="animate-spin" size={16} />
        ) : (
          <>{`Close Channel [ ${channelName}/${channelId} ]`}</>
        )}
      </Button>
      <Button
        variant="outline"
        className="w-full"
        disabled={loading}
        style={{ margin: '4px' }}
        onClick={() => setIsConfirmed(false)}
      >
        Cancel
      </Button>
    </div>
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
      <div className="flex justify-center items-center rounded-md p-1 bg-secondary flex-wrap">
        {renderButton(
          () => {
            setAmount(undefined);
            setIsForce(true);
          },
          'Yes',
          isForce
        )}
        {renderButton(() => setIsForce(false), 'No', !isForce)}
      </div>
      {!isForce && (
        <>
          <SingleLine>
            <Sub4Title>Fee:</Sub4Title>
            {!dontShow && (
              <span className="text-sm text-[#ffa940]">
                {`Minimum: ${minimum} sats/vByte`}
              </span>
            )}
          </SingleLine>
          <div className="flex justify-center items-center rounded-md p-1 bg-secondary flex-wrap">
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
          </div>
        </>
      )}
      {isType === 'none' && !isForce && (
        <>
          <SingleLine>
            <Sub4Title>Fee Amount:</Sub4Title>
          </SingleLine>
          <div className="flex justify-center items-center rounded-md p-1 bg-secondary flex-wrap">
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
          </div>
        </>
      )}
      {isType !== 'none' && !isForce && (
        <div className="flex items-center w-full my-2 flex-col md:flex-row justify-between">
          <div className="flex text-sm whitespace-nowrap flex-wrap md:my-0 my-2">
            <span>
              {isType === 'target' ? 'Target Blocks:' : 'Fee (Sats/Byte)'}
            </span>
          </div>
          <Input
            className="ml-0 md:ml-2"
            style={{ maxWidth: '500px' }}
            placeholder={isType === 'target' ? 'Blocks' : 'Sats/Byte'}
            type={'number'}
            value={amount != null && amount > 0 ? amount : ''}
            onChange={e => setAmount(Number(e.target.value))}
          />
        </div>
      )}
      <Button
        variant="destructive"
        disabled={!amount && !isForce}
        className="w-full"
        style={{ margin: '32px 0 0' }}
        onClick={() => setIsConfirmed(true)}
      >
        Close Channel <ChevronRight size={18} />
      </Button>
    </>
  );

  return isConfirmed ? renderWarning() : renderContent();
};
