import React, { useState, useEffect } from 'react';
import { toast } from 'react-toastify';
import { usePayAddressMutation } from '../../../../graphql/mutations/__generated__/sendToAddress.generated';
import { InputWithDeco } from '../../../../components/input/InputWithDeco';
import { useBitcoinFees } from '../../../../hooks/UseBitcoinFees';
import {
  Separation,
  SingleLine,
  SubTitle,
} from '../../../../components/generic/Styled';
import { getErrorContent } from '../../../../utils/error';
import { Input } from '../../../../components/input';
import {
  MultiButton,
  SingleButton,
} from '../../../../components/buttons/multiButton/MultiButton';
import { Price, getPrice } from '../../../../components/price/Price';
import { useConfigState } from '../../../../context/ConfigContext';
import Modal from '../../../../components/modal/ReactModal';
import { ColorButton } from '../../../../components/buttons/colorButton/ColorButton';
import { renderLine } from '../../../../components/generic/helpers';
import { usePriceState } from '../../../../context/PriceContext';

export const PegOutEcashCard = ({ setOpen }: { setOpen: () => void }) => {
  const { fast, halfHour, hour, minimum, dontShow } = useBitcoinFees();
  const { currency, displayValues, fetchFees } = useConfigState();
  const priceContext = usePriceState();
  const format = getPrice(currency, displayValues, priceContext);

  const [modalOpen, setModalOpen] = useState(false);

  const [address, setAddress] = useState('');
  const [tokens, setTokens] = useState(0);
  const [type, setType] = useState(dontShow || !fetchFees ? 'fee' : 'none');
  const [amount, setAmount] = useState(0);
  const [sendAll, setSendAll] = useState(false);

  const canSend = address !== '' && (sendAll || tokens > 0) && amount > 0;

  const [payAddress, { loading }] = usePayAddressMutation({
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

  const feeFormat = (amount: number): JSX.Element | string => {
    if (type === 'fee' || type === 'none') {
      return format({ amount });
    }
    return `${amount} blocks`;
  };

  const typeAmount = () => {
    switch (type) {
      case 'none':
      case 'fee':
        return { fee: amount };
      case 'target':
        return { target: amount };
      default:
        return {};
    }
  };

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
      <InputWithDeco
        title={'Send to Address'}
        value={address}
        placeholder={'Address'}
        inputCallback={value => setAddress(value)}
      />
      <Separation />
      <InputWithDeco title={'Send All'} noInput={true}>
        <MultiButton>
          {renderButton(() => setSendAll(true), 'Yes', sendAll)}
          {renderButton(() => setSendAll(false), 'No', !sendAll)}
        </MultiButton>
      </InputWithDeco>
      {!sendAll && (
        <InputWithDeco
          title={'Amount'}
          value={tokens}
          placeholder={'Sats'}
          amount={tokens}
          inputType={'number'}
          inputCallback={value => setTokens(Number(value))}
        />
      )}
      <Separation />
      <InputWithDeco title={'Fee'} noInput={true}>
        <MultiButton>
          {fetchFees &&
            !dontShow &&
            renderButton(
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
      </InputWithDeco>
      <InputWithDeco
        title={'Fee Amount'}
        value={amount}
        noInput={true}
        customAmount={
          type === 'target' ? (
            `(~${amount} blocks)`
          ) : (
            <>
              {'(~'}
              {feeFormat(amount * 223)}
              {')'}
            </>
          )
        }
      >
        {type !== 'none' ? (
          <Input
            value={amount && amount > 0 ? amount : undefined}
            maxWidth={'500px'}
            placeholder={type === 'target' ? 'Blocks' : 'Sats/Byte'}
            type={'number'}
            withMargin={'0 0 0 8px'}
            onChange={e => setAmount(Number(e.target.value))}
          />
        ) : (
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
        )}
      </InputWithDeco>
      {!dontShow && renderLine('Minimum', `${minimum} sat/vByte`)}
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
        {renderLine('Amount:', sendAll ? 'All' : <Price amount={tokens} />)}
        {renderLine('Address:', address)}
        {renderLine(
          'Fee:',
          type === 'target' ? `${amount} Blocks` : `${amount} Sats/Byte`
        )}
        <ColorButton
          onClick={() =>
            payAddress({
              variables: { address, ...typeAmount(), ...tokenAmount },
            })
          }
          disabled={!canSend}
          withMargin={'16px 0 0'}
          fullWidth={true}
          arrow={true}
          loading={loading}
        >
          Send To Address
        </ColorButton>
      </Modal>
    </>
  );
};
