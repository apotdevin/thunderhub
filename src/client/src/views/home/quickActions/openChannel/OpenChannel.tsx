import React, { useState, useEffect } from 'react';
import { ChevronRight, Settings, X } from 'react-feather';
import { toast } from 'react-toastify';
import { useOpenChannelMutation } from '../../../../graphql/mutations/__generated__/openChannel.generated';
import { InputWithDeco } from '../../../../components/input/InputWithDeco';
import { ColorButton } from '../../../../components/buttons/colorButton/ColorButton';
import { useBitcoinFees } from '../../../../hooks/UseBitcoinFees';
import { useConfigState } from '../../../../context/ConfigContext';
import { PeerSelect } from '../../../../components/select/specific/PeerSelect';
import { WarningText } from '../../../../views/stats/styles';
import styled from 'styled-components';
import {
  DarkSubTitle,
  Separation,
  SingleLine,
  SubCard,
} from '../../../../components/generic/Styled';
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

const LineTitle = styled.div`
  white-space: nowrap;
  font-size: 14px;
`;

export const OpenChannelCard = ({
  setOpenCard,
  initialPublicKey = '',
}: OpenChannelProps) => {
  const { fetchFees } = useConfigState();
  const { fast, halfHour, hour, minimum, dontShow } = useBitcoinFees();
  const [size, setSize] = useState(0);

  const [showAdvanced, setShowAdvanced] = useState<boolean>(false);
  const [pushType, setPushType] = useState('none');
  const [pushTokens, setPushTokens] = useState(0);

  const [isNewPeer, setIsNewPeer] = useState<boolean>(false);
  const [fee, setFee] = useState(0);
  const [publicKey, setPublicKey] = useState(initialPublicKey);
  const [privateChannel, setPrivateChannel] = useState(false);
  const [isMaxFunding, setIsMaxFunding] = useState(false);
  const [type, setType] = useState('fee');

  const [feeRate, setFeeRate] = useState<number | null>(null);
  const [baseFee, setBaseFee] = useState<number | null>(null);

  const [openChannel, { loading }] = useOpenChannelMutation({
    onError: error => toast.error(getErrorContent(error)),
    onCompleted: () => {
      toast.success('Channel Opened');
      setOpenCard('none');
    },
    refetchQueries: ['GetChannels', 'GetPendingChannels'],
  });

  const canOpen = publicKey !== '' && (size > 0 || isMaxFunding) && fee > 0;

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
          <WarningText>You will lose these pushed tokens.</WarningText>
        )}
      </SubCard>
    );
  };

  return (
    <>
      <InputWithDeco title={'Is New Peer'} noInput={true}>
        <MultiButton>
          {renderButton(() => setIsNewPeer(true), 'Yes', isNewPeer)}
          {renderButton(() => setIsNewPeer(false), 'No', !isNewPeer)}
        </MultiButton>
      </InputWithDeco>
      {!initialPublicKey && !isNewPeer && (
        <PeerSelect
          title={'Node'}
          callback={peer => setPublicKey(peer[0].public_key)}
        />
      )}
      {!initialPublicKey && isNewPeer && (
        <InputWithDeco
          title={'New Node'}
          value={publicKey}
          placeholder={'PublicKey@Socket'}
          inputCallback={value => setPublicKey(value)}
        />
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
        placeholder={'msats'}
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
                partner_public_key: publicKey || '',
                is_private: privateChannel,
                is_max_funding: isMaxFunding,
                give_tokens: pushAmount,
                chain_fee_tokens_per_vbyte: fee,
                base_fee_mtokens: baseFee == null ? undefined : baseFee + '',
                fee_rate: feeRate,
              },
            },
          })
        }
      >
        Open Channel
        <ChevronRight size={18} />
      </ColorButton>
    </>
  );
};
