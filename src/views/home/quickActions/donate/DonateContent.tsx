import * as React from 'react';
import { useGetLnPayLazyQuery } from 'src/graphql/queries/__generated__/getLnPay.generated';
import {
  Card,
  SubTitle,
  Separation,
  Sub4Title,
} from 'src/components/generic/Styled';
import { InputWithDeco } from 'src/components/input/InputWithDeco';
import { ColorButton } from 'src/components/buttons/colorButton/ColorButton';
import Modal from 'src/components/modal/ReactModal';
import { Emoji } from 'src/components/emoji/Emoji';
import { RequestModal } from '../../account/pay/RequestModal';

export const SupportBar = () => {
  const [modalOpen, modalOpenSet] = React.useState<boolean>(false);
  const [amount, amountSet] = React.useState<number>(0);
  const [invoice, invoiceSet] = React.useState<string>('');

  const [
    getInvoice,
    { data, loading: invoiceLoading },
  ] = useGetLnPayLazyQuery();

  React.useEffect(() => {
    if (data && data.getLnPay) {
      invoiceSet(data.getLnPay);
      modalOpenSet(true);
    }
  }, [data]);

  const handleReset = () => {
    modalOpenSet(false);
    amountSet(0);
    invoiceSet('');
  };

  return (
    <>
      <Card>
        <div style={{ textAlign: 'center' }}>
          <SubTitle>This project is completely free and open-source.</SubTitle>
          <Sub4Title>
            If you have enjoyed it, please consider supporting ThunderHub with
            some sats <Emoji symbol={'❤️'} label={'heart'} />
          </Sub4Title>
        </div>
        <Separation />
        <InputWithDeco
          title={'Amount'}
          amount={amount}
          inputType={'number'}
          inputCallback={value => amountSet(Number(value))}
        />
        <ColorButton
          onClick={() => getInvoice({ variables: { amount: amount * 1000 } })}
          loading={invoiceLoading}
          disabled={amount <= 0 || invoiceLoading}
          fullWidth={true}
          withMargin={'8px 0 0 0'}
        >
          Send
        </ColorButton>
      </Card>
      <Modal
        isOpen={modalOpen}
        closeCallback={() => {
          modalOpenSet(false);
          amountSet(0);
        }}
      >
        <RequestModal request={invoice} handleReset={handleReset} />
      </Modal>
    </>
  );
};
