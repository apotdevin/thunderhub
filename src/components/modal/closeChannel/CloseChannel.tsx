import React, { useState, useEffect } from 'react';
import { useMutation, useQuery } from '@apollo/react-hooks';
import {
  Separation,
  SingleLine,
  SubTitle,
  Sub4Title,
} from '../../generic/Styled';
import { AlertTriangle } from '../../generic/Icons';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { getErrorContent } from '../../../utils/error';
import { SecureButton } from '../../buttons/secureButton/SecureButton';
import { ColorButton } from '../../buttons/colorButton/ColorButton';
import {
  MultiButton,
  SingleButton,
} from '../../buttons/multiButton/MultiButton';
import { Input } from '../../input/Input';
import { GET_BITCOIN_FEES } from '../../../graphql/query';
import { CLOSE_CHANNEL } from '../../../graphql/mutation';

interface CloseChannelProps {
  setModalOpen: (status: boolean) => void;
  channelId: string;
  channelName: string;
}

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
  setModalOpen,
  channelId,
  channelName,
}: CloseChannelProps) => {
  const [isForce, setIsForce] = useState<boolean>(false);
  const [isType, setIsType] = useState<string>('none');
  const [amount, setAmount] = useState<number>(0);
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false);

  const [fast, setFast] = useState(0);
  const [halfHour, setHalfHour] = useState(0);
  const [hour, setHour] = useState(0);

  const { data: feeData } = useQuery(GET_BITCOIN_FEES, {
    onError: error => toast.error(getErrorContent(error)),
  });

  useEffect(() => {
    if (feeData && feeData.getBitcoinFees) {
      const { fast, halfHour, hour } = feeData.getBitcoinFees;
      setAmount(fast);
      setFast(fast);
      setHalfHour(halfHour);
      setHour(hour);
    }
  }, [feeData]);

  const [closeChannel] = useMutation(CLOSE_CHANNEL, {
    onCompleted: data => {
      if (data.closeChannel) {
        toast.success('Channel Closed');
      }
    },
    onError: error => toast.error(getErrorContent(error)),
    refetchQueries: [
      'GetChannels',
      'GetPendingChannels',
      'GetClosedChannels',
      'GetChannelAmountInfo',
    ],
  });

  const handleOnlyClose = () => setModalOpen(false);

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
      <AlertTriangle size={'32px'} color={'red'} />
      <SubTitle>Are you sure you want to close the channel?</SubTitle>
      <SecureButton
        callback={closeChannel}
        variables={{
          id: channelId,
          forceClose: isForce,
          ...(isType !== 'none'
            ? isType === 'fee'
              ? { tokens: amount }
              : { target: amount }
            : {}),
        }}
        color={'red'}
        disabled={false}
        withMargin={'4px'}
      >
        {`Close Channel [ ${channelName}/${channelId} ]`}
      </SecureButton>
      <ColorButton withMargin={'4px'} onClick={handleOnlyClose}>
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
        <Sub4Title>Fee:</Sub4Title>
      </SingleLine>
      <MultiButton>
        {renderButton(() => setIsType('none'), 'Auto', isType === 'none')}
        {renderButton(() => setIsType('fee'), 'Fee', isType === 'fee')}
        {renderButton(() => setIsType('target'), 'Target', isType === 'target')}
      </MultiButton>
      {isType === 'none' && (
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
      {isType !== 'none' && (
        <>
          <SingleLine>
            <Sub4Title>
              {isType === 'target' ? 'Target Blocks:' : 'Fee (Sats/Byte)'}
            </Sub4Title>
          </SingleLine>
          <SingleLine>
            <Input
              placeholder={isType === 'target' ? 'Blocks' : 'Sats/Byte'}
              type={'number'}
              onChange={e => setAmount(Number(e.target.value))}
            />
          </SingleLine>
        </>
      )}
      <SingleLine>
        <Sub4Title>Force Close Channel:</Sub4Title>
      </SingleLine>
      <MultiButton>
        {renderButton(() => setIsForce(true), 'Yes', isForce)}
        {renderButton(() => setIsForce(false), 'No', !isForce)}
      </MultiButton>
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
