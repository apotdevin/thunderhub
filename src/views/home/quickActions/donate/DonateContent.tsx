import * as React from 'react';
import { useGetLnPayLazyQuery } from 'src/graphql/queries/__generated__/getLnPay.generated';
import { usePayInvoiceMutation } from 'src/graphql/mutations/__generated__/pay.generated';
import {
  Card,
  SubTitle,
  Separation,
  Sub4Title,
} from 'src/components/generic/Styled';
import { InputWithDeco } from 'src/components/input/InputWithDeco';
import { SecureButton } from 'src/components/buttons/secureButton/SecureButton';
import { cleanLightningInvoice } from 'src/utils/helpers';
import { ColorButton } from 'src/components/buttons/colorButton/ColorButton';
import Modal from 'src/components/modal/ReactModal';
import { toast } from 'react-toastify';
import { getErrorContent } from 'src/utils/error';
import { Emoji } from 'src/components/emoji/Emoji';
import { RequestModal } from '../../account/pay/Modals';

export const SupportBar = () => {
  const [modalOpen, modalOpenSet] = React.useState<boolean>(false);
  const [amount, amountSet] = React.useState<number>(0);
  const [invoice, invoiceSet] = React.useState<string>('');

  const [
    getInvoice,
    { data, loading: invoiceLoading },
  ] = useGetLnPayLazyQuery();

  const [makePayment, { loading: payLoading }] = usePayInvoiceMutation({
    onError: error => toast.error(getErrorContent(error)),
    onCompleted: () => {
      toast.success('Payment Sent');
      invoiceSet('');
      amountSet(0);
      modalOpenSet(false);
    },
    refetchQueries: ['GetInOut', 'GetNodeInfo', 'GetBalances'],
  });

  React.useEffect(() => {
    if (data && data.getLnPay) {
      invoiceSet(data.getLnPay);
      modalOpenSet(true);
    }
  }, [data]);

  const renderButton = () => (
    <SecureButton
      callback={makePayment}
      variables={{ request: cleanLightningInvoice(invoice) }}
      disabled={!invoice || payLoading}
      withMargin={'16px 0 0'}
      loading={payLoading}
      fullWidth={true}
    >
      Send
    </SecureButton>
  );

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
        <RequestModal request={invoice}>{renderButton()}</RequestModal>
      </Modal>
    </>
  );
};
