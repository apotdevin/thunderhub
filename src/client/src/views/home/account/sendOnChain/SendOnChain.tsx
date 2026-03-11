import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { usePayAddressMutation } from '../../../../graphql/mutations/__generated__/sendToAddress.generated';
import { Input } from '@/components/ui/input';
import { useBitcoinFees } from '../../../../hooks/UseBitcoinFees';
import {
  Separation,
  SingleLine,
  SubTitle,
} from '../../../../components/generic/Styled';
import { getErrorContent } from '../../../../utils/error';
import { cn } from '@/lib/utils';
import { Price, getPrice } from '../../../../components/price/Price';
import { useConfigState } from '../../../../context/ConfigContext';
import Modal from '../../../../components/modal/ReactModal';
import { Button } from '@/components/ui/button';
import { ChevronRight, Loader2 } from 'lucide-react';
import { renderLine } from '../../../../components/generic/helpers';
import { usePriceState } from '../../../../context/PriceContext';

export const SendOnChainCard = ({ setOpen }: { setOpen: () => void }) => {
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
    <Button
      variant={selected ? 'default' : 'ghost'}
      onClick={() => onClick()}
      className={cn('grow', !selected && 'text-foreground')}
    >
      {text}
    </Button>
  );

  return (
    <>
      <div className="flex items-center w-full my-2 flex-col md:flex-row justify-between">
        <div className="flex text-sm whitespace-nowrap flex-wrap md:my-0 my-2">
          <span>Send to Address</span>
        </div>
        <Input
          className="ml-0 md:ml-2"
          style={{ maxWidth: '500px' }}
          value={address}
          placeholder={'Address'}
          onChange={e => setAddress(e.target.value)}
        />
      </div>
      <Separation />
      <div className="flex items-center w-full my-2 flex-col md:flex-row justify-between">
        <div className="flex text-sm whitespace-nowrap flex-wrap md:my-0 my-2">
          <span>Send All</span>
        </div>
        <div className="flex justify-center items-center rounded-md p-1 bg-secondary flex-wrap">
          {renderButton(() => setSendAll(true), 'Yes', sendAll)}
          {renderButton(() => setSendAll(false), 'No', !sendAll)}
        </div>
      </div>
      {!sendAll && (
        <div className="flex items-center w-full my-2 flex-col md:flex-row justify-between">
          <div className="flex text-sm whitespace-nowrap flex-wrap md:my-0 my-2">
            <span>Amount</span>
            <span className="text-muted-foreground mx-2 ml-4">
              <Price amount={tokens} />
            </span>
          </div>
          <Input
            className="ml-0 md:ml-2"
            style={{ maxWidth: '500px' }}
            placeholder={'Sats'}
            type={'number'}
            value={tokens && tokens > 0 ? tokens : ''}
            onChange={e => setTokens(Number(e.target.value))}
          />
        </div>
      )}
      <Separation />
      <div className="flex items-center w-full my-2 flex-col md:flex-row justify-between">
        <div className="flex text-sm whitespace-nowrap flex-wrap md:my-0 my-2">
          <span>Fee</span>
        </div>
        <div className="flex justify-center items-center rounded-md p-1 bg-secondary flex-wrap">
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
        </div>
      </div>
      <div className="flex items-center w-full my-2 flex-col md:flex-row justify-between">
        <div className="flex text-sm whitespace-nowrap flex-wrap md:my-0 my-2">
          <span>Fee Amount</span>
          <span className="text-muted-foreground mx-2 ml-4">
            {type === 'target' ? (
              `(~${amount} blocks)`
            ) : (
              <span>
                {'(~'}
                {feeFormat(amount * 223)}
                {')'}
              </span>
            )}
          </span>
        </div>
        {type !== 'none' ? (
          <Input
            className="ml-0 md:ml-2"
            style={{ maxWidth: '500px' }}
            value={amount && amount > 0 ? amount : ''}
            placeholder={type === 'target' ? 'Blocks' : 'Sats/Byte'}
            type={'number'}
            onChange={e => setAmount(Number(e.target.value))}
          />
        ) : (
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
        )}
      </div>
      {!dontShow && renderLine('Minimum', `${minimum} sat/vByte`)}
      <Separation />
      <Button
        variant="outline"
        disabled={!canSend || loading}
        style={{ margin: '16px 0 0' }}
        className="w-full"
        onClick={() => {
          setModalOpen(true);
        }}
      >
        {loading ? <Loader2 className="animate-spin" size={16} /> : <>Send</>}
      </Button>
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
        <Button
          variant="outline"
          onClick={() =>
            payAddress({
              variables: { address, ...typeAmount(), ...tokenAmount },
            })
          }
          disabled={!canSend || loading}
          style={{ margin: '16px 0 0' }}
          className="w-full"
        >
          {loading ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <>
              Send To Address <ChevronRight size={18} />
            </>
          )}
        </Button>
      </Modal>
    </>
  );
};
