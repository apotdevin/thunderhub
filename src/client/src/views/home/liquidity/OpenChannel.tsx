import { useState, useEffect } from 'react';
import { ChevronRight, Settings, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useOpenChannelMutation } from '../../../graphql/mutations/__generated__/openChannel.generated';
import { Input } from '@/components/ui/input';
import { Price } from '../../../components/price/Price';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { useBitcoinFees } from '../../../hooks/UseBitcoinFees';
import { useConfigState } from '../../../context/ConfigContext';
import { PeerSelect } from '../../../components/select/specific/PeerSelect';
import {
  Card,
  DarkSubTitle,
  Separation,
  SingleLine,
  SubCard,
} from '../../../components/generic/Styled';
import { getErrorContent } from '../../../utils/error';
import { cn } from '@/lib/utils';

type OpenChannelProps = {
  closeCbk: () => void;
};

export const OpenChannel = ({ closeCbk }: OpenChannelProps) => {
  const [useRecommended, setUseRecommended] = useState(true);

  const { fetchFees } = useConfigState();
  const { fast, halfHour, hour, minimum, dontShow } =
    useBitcoinFees(!fetchFees);
  const [size, setSize] = useState(0);

  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [pushType, setPushType] = useState('none');
  const [pushTokens, setPushTokens] = useState(0);

  const [isNewPeer, setIsNewPeer] = useState<boolean>(true);
  const [fee, setFee] = useState(0);
  const [publicKey, setPublicKey] = useState('');
  const [privateChannel, setPrivateChannel] = useState(false);
  const [isMaxFunding, setIsMaxFunding] = useState(false);
  const [type, setType] = useState(fetchFees ? 'none' : 'fee');

  const [feeRate, setFeeRate] = useState<number | null>(null);
  const [baseFee, setBaseFee] = useState<number | null>(null);

  const [openChannel, { loading }] = useOpenChannelMutation({
    onError: error => toast.error(getErrorContent(error)),
    onCompleted: () => {
      toast.success('Channel Opened');
      closeCbk();
    },
    refetchQueries: ['GetChannels', 'GetPendingChannels'],
  });

  const canOpen =
    (publicKey !== '' || useRecommended) &&
    (size > 0 || isMaxFunding) &&
    fee > 0;

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
    selected: boolean,
    variant?: 'default' | 'destructive'
  ) => (
    <Button
      variant={selected ? variant || 'default' : 'ghost'}
      onClick={() => onClick()}
      className={cn('grow', !selected && 'text-foreground')}
    >
      {text}
    </Button>
  );

  const renderAdvanced = () => {
    if (!showAdvanced) return null;
    return (
      <SubCard withMargin={'16px 0 0'}>
        <div className="flex items-center w-full my-2 flex-col md:flex-row justify-between">
          <div className="flex text-sm whitespace-nowrap flex-wrap md:my-0 my-2">
            <span>Type</span>
          </div>
          <div className="flex justify-center items-center rounded-md p-1 bg-secondary flex-wrap">
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
          </div>
        </div>
        <div className="flex items-center w-full my-2 flex-col md:flex-row justify-between">
          <div className="flex text-sm whitespace-nowrap flex-wrap md:my-0 my-2">
            <span>Push Tokens to Partner</span>
          </div>
          <div className="flex justify-center items-center rounded-md p-1 bg-secondary flex-wrap">
            {renderButton(
              () => setPushType('none'),
              'None',
              pushType === 'none'
            )}
            {renderButton(
              () => setPushType('half'),
              'Half',
              pushType === 'half',
              'destructive'
            )}
            {renderButton(
              () => setPushType('custom'),
              'Custom',
              pushType === 'custom',
              'destructive'
            )}
          </div>
        </div>
        {pushType === 'custom' && (
          <div className="flex items-center w-full my-2 flex-col md:flex-row justify-between">
            <div className="flex text-sm whitespace-nowrap flex-wrap md:my-0 my-2">
              <span>Amount</span>
              <span className="text-muted-foreground mx-2 ml-4">
                <Price amount={Math.min(pushTokens, size * 0.9)} />
              </span>
            </div>
            <Input
              className="ml-0 md:ml-2"
              style={{ maxWidth: '500px' }}
              placeholder={`Sats (Max: ${size * 0.9} sats)`}
              type={'number'}
              value={
                Math.min(pushTokens, size * 0.9) > 0
                  ? Math.min(pushTokens, size * 0.9)
                  : ''
              }
              onChange={e => setPushTokens(Number(e.target.value))}
            />
          </div>
        )}
        {pushType !== 'none' && (
          <div className="text-center text-sm bg-[oklch(0.987_0.022_95.277)] text-[oklch(0.666_0.179_58.318)] p-2 rounded-lg">
            You will lose these pushed tokens.
          </div>
        )}
      </SubCard>
    );
  };

  return (
    <Card>
      <div className="flex items-center w-full my-2 flex-col md:flex-row justify-between">
        <div className="flex text-sm whitespace-nowrap flex-wrap md:my-0 my-2">
          <span>Recommended Peer</span>
        </div>
        <Switch checked={useRecommended} onCheckedChange={setUseRecommended} />
      </div>

      <Separation />

      {useRecommended ? (
        <div className="text-center text-sm bg-[oklch(0.982_0.018_155.826)] text-[oklch(0.627_0.194_149.214)] p-2 rounded-lg">
          Connect to the{' '}
          <a
            style={{ color: 'inherit' }}
            href={'https://amboss.tech/rails/stats'}
            target="__blank"
          >
            Amboss Rails cluster
          </a>{' '}
          - optimized for fast, reliable, high-throughput payments.
        </div>
      ) : (
        <>
          <div className="text-center text-sm bg-[oklch(0.987_0.022_95.277)] text-[oklch(0.666_0.179_58.318)] p-2 rounded-lg">
            Performance may vary. For the best experience, connect to the Amboss
            Rails cluster.
          </div>

          <div className="flex items-center w-full my-2 flex-col md:flex-row justify-between">
            <div className="flex text-sm whitespace-nowrap flex-wrap md:my-0 my-2">
              <span>Is New Peer</span>
            </div>
            <Switch checked={isNewPeer} onCheckedChange={setIsNewPeer} />
          </div>

          {isNewPeer ? (
            <div className="flex items-center w-full my-2 flex-col md:flex-row justify-between">
              <div className="flex text-sm whitespace-nowrap flex-wrap md:my-0 my-2">
                <span>New Node</span>
              </div>
              <Input
                className="ml-0 md:ml-2"
                style={{ maxWidth: '500px' }}
                value={publicKey}
                placeholder={'PublicKey@Socket'}
                onChange={e => setPublicKey(e.target.value)}
              />
            </div>
          ) : (
            <PeerSelect
              title={'Node'}
              callback={peer => setPublicKey(peer[0].public_key)}
            />
          )}
        </>
      )}

      <Separation />

      <div className="flex items-center w-full my-2 flex-col md:flex-row justify-between">
        <div className="flex text-sm whitespace-nowrap flex-wrap md:my-0 my-2">
          <span>Max Size</span>
        </div>
        <Switch
          checked={isMaxFunding}
          onCheckedChange={v => {
            setIsMaxFunding(v);
            if (v) setSize(0);
          }}
        />
      </div>

      {!isMaxFunding ? (
        <div className="flex items-center w-full my-2 flex-col md:flex-row justify-between">
          <div className="flex text-sm whitespace-nowrap flex-wrap md:my-0 my-2">
            <span>Channel Size</span>
            <span className="text-muted-foreground mx-2 ml-4">
              <Price amount={size} />
            </span>
          </div>
          <Input
            className="ml-0 md:ml-2"
            style={{ maxWidth: '500px' }}
            placeholder={'Sats'}
            type={'number'}
            value={size && size > 0 ? size : ''}
            onChange={e => setSize(Number(e.target.value))}
          />
        </div>
      ) : null}

      <Separation />

      <div className="flex items-center w-full my-2 flex-col md:flex-row justify-between">
        <div className="flex text-sm whitespace-nowrap flex-wrap md:my-0 my-2">
          <span>Fee Rate</span>
          {feeRate != null && (
            <span className="text-muted-foreground mx-2 ml-4">
              <Price amount={feeRate} />
            </span>
          )}
        </div>
        <Input
          className="ml-0 md:ml-2"
          style={{ maxWidth: '500px' }}
          placeholder={'ppm'}
          type={'number'}
          value={feeRate != null && feeRate > 0 ? feeRate : ''}
          onChange={e => {
            if (e.target.value === '') {
              setFeeRate(null);
            } else {
              setFeeRate(Number(e.target.value));
            }
          }}
        />
      </div>

      <div className="flex items-center w-full my-2 flex-col md:flex-row justify-between">
        <div className="flex text-sm whitespace-nowrap flex-wrap md:my-0 my-2">
          <span>Base Fee</span>
          {baseFee != null && (
            <span className="text-muted-foreground mx-2 ml-4">
              <Price amount={baseFee} />
            </span>
          )}
        </div>
        <Input
          className="ml-0 md:ml-2"
          style={{ maxWidth: '500px' }}
          placeholder={'sats'}
          type={'number'}
          value={baseFee != null && baseFee > 0 ? baseFee : ''}
          onChange={e => {
            if (e.target.value === '') {
              setBaseFee(null);
            } else {
              setBaseFee(Number(e.target.value));
            }
          }}
        />
      </div>

      <Separation />

      {fetchFees && !dontShow && (
        <>
          <div className="flex items-center w-full my-2 flex-col md:flex-row justify-between">
            <div className="flex text-sm whitespace-nowrap flex-wrap md:my-0 my-2">
              <span>Fee</span>
            </div>
            <div className="flex justify-center items-center rounded-md p-1 bg-secondary flex-wrap">
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
                'Fee (sats/vByte)',
                type === 'fee'
              )}
            </div>
          </div>
          <SingleLine>
            <div className="whitespace-nowrap text-sm">Minimum</div>
            <DarkSubTitle>{`${minimum} sat/vByte`}</DarkSubTitle>
          </SingleLine>
        </>
      )}

      <div className="flex items-center w-full my-2 flex-col md:flex-row justify-between">
        <div className="flex text-sm whitespace-nowrap flex-wrap md:my-0 my-2">
          <span>Fee Amount</span>
          <span className="text-muted-foreground mx-2 ml-4">
            <Price amount={fee * 223} />
          </span>
        </div>
        {type !== 'none' && (
          <Input
            className="ml-0 md:ml-2"
            style={{ maxWidth: '500px' }}
            placeholder={'sats/vByte'}
            type={'number'}
            onChange={e => setFee(Number(e.target.value))}
          />
        )}
        {type === 'none' && (
          <div className="flex justify-center items-center rounded-md p-1 bg-secondary flex-wrap">
            {renderButton(
              () => setFee(fast),
              `Fastest (${fast})`,
              fee === fast
            )}
            {halfHour !== fast &&
              renderButton(
                () => setFee(halfHour),
                `Half Hour (${halfHour})`,
                fee === halfHour
              )}
            {renderButton(() => setFee(hour), `Hour (${hour})`, fee === hour)}
          </div>
        )}
      </div>
      <Separation />
      <SingleLine>
        <div className="whitespace-nowrap text-sm">Advanced</div>
        <Button variant="outline" onClick={() => setShowAdvanced(s => !s)}>
          {showAdvanced ? <X size={16} /> : <Settings size={16} />}
        </Button>
      </SingleLine>
      {renderAdvanced()}
      <Button
        variant="outline"
        style={{ margin: '32px 0 0' }}
        className="w-full"
        disabled={!canOpen || loading}
        onClick={() =>
          openChannel({
            variables: {
              input: {
                channel_size: size,
                is_recommended: useRecommended,
                partner_public_key: publicKey || '',
                is_private: privateChannel,
                is_max_funding: isMaxFunding,
                give_tokens: pushAmount,
                chain_fee_tokens_per_vbyte: fee,
                base_fee_mtokens:
                  baseFee == null ? undefined : baseFee * 1000 + '',
                fee_rate: feeRate,
              },
            },
          })
        }
      >
        {loading ? (
          <Loader2 className="animate-spin" size={16} />
        ) : (
          <>
            Open Channel <ChevronRight size={18} />
          </>
        )}
      </Button>
    </Card>
  );
};
