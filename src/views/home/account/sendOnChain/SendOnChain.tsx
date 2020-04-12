import React, { useState, useEffect } from 'react';
import {
  NoWrapTitle,
  DarkSubTitle,
  Separation,
  SingleLine,
  ResponsiveLine,
  SubTitle,
} from '../../../../components/generic/Styled';
import { useMutation } from '@apollo/react-hooks';
import { PAY_ADDRESS } from '../../../../graphql/mutation';
import styled from 'styled-components';
import { toast } from 'react-toastify';
import { getErrorContent } from '../../../../utils/error';
import { useBitcoinState } from '../../../../context/BitcoinContext';
import { SecureButton } from '../../../../components/buttons/secureButton/SecureButton';
import { Input } from '../../../../components/input/Input';
import { useSize } from '../../../../hooks/UseSize';
import {
  MultiButton,
  SingleButton,
} from '../../../../components/buttons/multiButton/MultiButton';
import { Price, getPrice } from '../../../../components/price/Price';
import { mediaWidths, mediaDimensions } from '../../../../styles/Themes';
import { useSettings } from '../../../../context/SettingsContext';
import Modal from '../../../../components/modal/ReactModal';
import { ColorButton } from '../../../../components/buttons/colorButton/ColorButton';
import { renderLine } from '../../../../components/generic/Helpers';
import { usePriceState } from '../../../../context/PriceContext';

const ResponsiveWrap = styled(SingleLine)`
  @media (${mediaWidths.mobile}) {
    flex-wrap: wrap;
  }
`;

const NoWrap = styled.div`
  margin-left: 8px;
  white-space: nowrap;
`;

const Margin = styled.div`
  margin-left: 8px;
  margin-right: 24px;
`;

export const SendOnChainCard = ({ setOpen }: { setOpen: () => void }) => {
  const { currency } = useSettings();
  const priceContext = usePriceState();
  const format = getPrice(currency, priceContext);

  const [modalOpen, setModalOpen] = useState(false);

  const { width } = useSize();
  const [address, setAddress] = useState('');
  const [tokens, setTokens] = useState(0);
  const [type, setType] = useState('none');
  const [amount, setAmount] = useState(0);
  const [sendAll, setSendAll] = useState(false);

  const canSend = address !== '' && (sendAll || tokens > 0) && amount > 0;

  const { fast, halfHour, hour } = useBitcoinState();

  const [payAddress, { loading }] = useMutation(PAY_ADDRESS, {
    onError: error => toast.error(getErrorContent(error)),
    onCompleted: () => {
      toast.success('Payment Sent!');
      setOpen();
    },
    refetchQueries: ['GetNodeInfo', 'GetBalances'],
  });

  useEffect(() => {
    if (type === 'none' && amount === 0) {
      setAmount(fast);
    }
  }, [type, amount, fast]);

  const feeFormat = (amount: number) => {
    if (type === 'fee' || type === 'none') {
      return format({ amount });
    }
    return `${amount} blocks`;
  };

  const typeAmount =
    type === 'fee'
      ? { fee: amount }
      : type === 'target'
      ? { target: amount }
      : {};

  const tokenAmount = sendAll ? { sendAll } : { tokens };

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
    <>
      <ResponsiveLine>
        <NoWrapTitle>Send to Address:</NoWrapTitle>
        <Input
          placeholder={'Address'}
          withMargin={width <= mediaDimensions.mobile ? '' : '0 0 0 24px'}
          onChange={e => setAddress(e.target.value)}
        />
      </ResponsiveLine>
      <Separation />
      <SingleLine>
        <NoWrapTitle>Send All:</NoWrapTitle>
        <MultiButton>
          {renderButton(() => setSendAll(true), 'Yes', sendAll)}
          {renderButton(() => setSendAll(false), 'No', !sendAll)}
        </MultiButton>
      </SingleLine>
      {!sendAll && (
        <SingleLine>
          <ResponsiveWrap>
            <NoWrapTitle>Amount:</NoWrapTitle>
            <Margin>
              <NoWrap>
                <DarkSubTitle>
                  <Price amount={tokens} />
                </DarkSubTitle>
              </NoWrap>
            </Margin>
          </ResponsiveWrap>
          <Input
            placeholder={'Sats'}
            withMargin={'0 0 0 8px'}
            type={'number'}
            onChange={e => setTokens(Number(e.target.value))}
          />
        </SingleLine>
      )}
      <Separation />
      <SingleLine>
        <NoWrapTitle>Fee:</NoWrapTitle>
        <MultiButton margin={'8px 0 8px 16px'}>
          {renderButton(
            () => {
              setType('none');
              setAmount(fast);
            },
            'Auto',
            type === 'none'
          )}
          {renderButton(
            () => {
              setType('fee');
              setAmount(0);
            },
            'Fee (Sats/Byte)',
            type === 'fee'
          )}
          {renderButton(
            () => {
              setType('target');
              setAmount(0);
            },
            'Target Confirmations',
            type === 'target'
          )}
        </MultiButton>
      </SingleLine>
      <SingleLine>
        <ResponsiveWrap>
          <NoWrapTitle>Fee Amount:</NoWrapTitle>
          <NoWrap>
            <DarkSubTitle>{`(~${
              type === 'target' ? `${amount} blocks` : feeFormat(amount * 223)
            })`}</DarkSubTitle>
          </NoWrap>
        </ResponsiveWrap>
        {type !== 'none' && (
          <>
            <Input
              placeholder={type === 'target' ? 'Blocks' : 'Sats/Byte'}
              type={'number'}
              withMargin={'0 0 0 8px'}
              onChange={e => setAmount(Number(e.target.value))}
            />
          </>
        )}
        {type === 'none' && (
          <MultiButton margin={'8px 0 8px 16px'}>
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
        )}
      </SingleLine>
      <Separation />
      <ColorButton
        disabled={!canSend}
        withMargin={'16px 0 0'}
        loading={loading}
        fullWidth={true}
        onClick={() => {
          setModalOpen(true);
        }}
      >
        Send
      </ColorButton>
      <Modal isOpen={modalOpen} closeCallback={() => setModalOpen(false)}>
        <SingleLine>
          <SubTitle>Send to Address</SubTitle>
        </SingleLine>
        {renderLine('Amount:', <Price amount={tokens} />)}
        {renderLine('Address:', address)}
        {renderLine(
          'Fee:',
          type === 'target' ? `${amount} Blocks` : `${amount} Sats/Byte`
        )}
        <SecureButton
          callback={payAddress}
          variables={{ address, ...typeAmount, ...tokenAmount }}
          disabled={!canSend}
          withMargin={'16px 0 0'}
          fullWidth={true}
          arrow={true}
          loading={loading}
        >
          Send To Address
        </SecureButton>
      </Modal>
    </>
  );
};
