import { useState, useEffect } from 'react';
import { ChevronRight, Settings, X } from 'lucide-react';
import { toast } from 'react-toastify';
import { useOpenChannelMutation } from '../../../graphql/mutations/__generated__/openChannel.generated';
import { InputWithDeco } from '../../../components/input/InputWithDeco';
import { ColorButton } from '../../../components/buttons/colorButton/ColorButton';
import { useBitcoinFees } from '../../../hooks/UseBitcoinFees';
import { useConfigState } from '../../../context/ConfigContext';
import { PeerSelect } from '../../../components/select/specific/PeerSelect';
import styled from 'styled-components';
import {
  Card,
  DarkSubTitle,
  Separation,
  SingleLine,
  SubCard,
} from '../../../components/generic/Styled';
import { getErrorContent } from '../../../utils/error';
import { Input } from '../../../components/input';
import {
  SingleButton,
  MultiButton,
} from '../../../components/buttons/multiButton/MultiButton';

type OpenChannelProps = {
  closeCbk: () => void;
};

const LineTitle = styled.div`
  white-space: nowrap;
  font-size: 14px;
`;

const RecommendedBanner = styled.div`
  text-align: center;
  font-size: 14px;
  background: oklch(0.982 0.018 155.826);
  color: oklch(0.627 0.194 149.214);
  padding: 8px;
  border-radius: 8px;
`;

const NotRecommendedBanner = styled.div`
  text-align: center;
  font-size: 14px;
  background: oklch(0.987 0.022 95.277);
  color: oklch(0.666 0.179 58.318);
  padding: 8px;
  border-radius: 8px;
`;

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
    buttonColor?: string
  ) => (
    <SingleButton selected={selected} onClick={onClick} color={buttonColor}>
      {text}
    </SingleButton>
  );

  const renderAdvanced = () => {
    if (!showAdvanced) return null;
    return (
      <SubCard withMargin={'16px 0 0'}>
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
        <InputWithDeco title={'Push Tokens to Partner'} noInput={true}>
          <MultiButton>
            {renderButton(
              () => setPushType('none'),
              'None',
              pushType === 'none'
            )}
            {renderButton(
              () => setPushType('half'),
              'Half',
              pushType === 'half',
              'red'
            )}
            {renderButton(
              () => setPushType('custom'),
              'Custom',
              pushType === 'custom',
              'red'
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
        {pushType !== 'none' && (
          <NotRecommendedBanner>
            You will lose these pushed tokens.
          </NotRecommendedBanner>
        )}
      </SubCard>
    );
  };

  return (
    <Card>
      <InputWithDeco title={'Recommended Peer'} noInput={true}>
        <MultiButton>
          {renderButton(() => setUseRecommended(true), 'Yes', useRecommended)}
          {renderButton(() => setUseRecommended(false), 'No', !useRecommended)}
        </MultiButton>
      </InputWithDeco>

      <Separation />

      {useRecommended ? (
        <RecommendedBanner>
          Connect to the{' '}
          <a
            style={{ color: 'inherit' }}
            href={'https://amboss.tech/rails/stats'}
            target="__blank"
          >
            Amboss Rails cluster
          </a>{' '}
          - optimized for fast, reliable, high-throughput payments.
        </RecommendedBanner>
      ) : (
        <>
          <NotRecommendedBanner>
            ⚠️ Performance may vary. For the best experience, connect to the
            Amboss Rails cluster.
          </NotRecommendedBanner>

          <InputWithDeco title={'Is New Peer'} noInput={true}>
            <MultiButton>
              {renderButton(() => setIsNewPeer(true), 'Yes', isNewPeer)}
              {renderButton(() => setIsNewPeer(false), 'No', !isNewPeer)}
            </MultiButton>
          </InputWithDeco>

          {isNewPeer ? (
            <InputWithDeco
              title={'New Node'}
              value={publicKey}
              placeholder={'PublicKey@Socket'}
              inputCallback={value => setPublicKey(value)}
            />
          ) : (
            <PeerSelect
              title={'Node'}
              callback={peer => setPublicKey(peer[0].public_key)}
            />
          )}
        </>
      )}

      <Separation />

      <InputWithDeco title={'Max Size'} noInput={true}>
        <MultiButton>
          {renderButton(
            () => {
              setIsMaxFunding(true);
              setSize(0);
            },
            'Yes',
            isMaxFunding
          )}
          {renderButton(() => setIsMaxFunding(false), 'No', !isMaxFunding)}
        </MultiButton>
      </InputWithDeco>

      {!isMaxFunding ? (
        <InputWithDeco
          title={'Channel Size'}
          value={size}
          placeholder={'Sats'}
          amount={size}
          inputType={'number'}
          inputCallback={value => setSize(Number(value))}
        />
      ) : null}

      <Separation />

      <InputWithDeco
        title={'Fee Rate'}
        value={feeRate}
        placeholder={'ppm'}
        amount={feeRate}
        inputType={'number'}
        inputCallback={value => {
          if (value == null) {
            setFeeRate(null);
          } else {
            setFeeRate(Number(value));
          }
        }}
      />

      <InputWithDeco
        title={'Base Fee'}
        value={baseFee}
        placeholder={'sats'}
        amount={baseFee}
        inputType={'number'}
        inputCallback={value => {
          if (value == null) {
            setBaseFee(null);
          } else {
            setBaseFee(Number(value));
          }
        }}
      />

      <Separation />

      {fetchFees && !dontShow && (
        <>
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
                'Fee (sats/vByte)',
                type === 'fee'
              )}
            </MultiButton>
          </InputWithDeco>
          <SingleLine>
            <LineTitle>Minimum</LineTitle>
            <DarkSubTitle>{`${minimum} sat/vByte`}</DarkSubTitle>
          </SingleLine>
        </>
      )}

      <InputWithDeco title={'Fee Amount'} amount={fee * 223} noInput={true}>
        {type !== 'none' && (
          <Input
            maxWidth={'500px'}
            placeholder={'sats/vByte'}
            type={'number'}
            onChange={e => setFee(Number(e.target.value))}
          />
        )}
        {type === 'none' && (
          <MultiButton>
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
          </MultiButton>
        )}
      </InputWithDeco>
      <Separation />
      <SingleLine>
        <LineTitle>Advanced</LineTitle>
        <ColorButton onClick={() => setShowAdvanced(s => !s)}>
          {showAdvanced ? <X size={16} /> : <Settings size={16} />}
        </ColorButton>
      </SingleLine>
      {renderAdvanced()}
      <ColorButton
        withMargin={'32px 0 0'}
        loading={loading}
        fullWidth={true}
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
        Open Channel
        <ChevronRight size={18} />
      </ColorButton>
    </Card>
  );
};
