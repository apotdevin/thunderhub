import { ColorButton } from 'src/components/buttons/colorButton/ColorButton';
import { toast } from 'react-toastify';
import Modal from 'src/components/modal/ReactModal';
import { useCreateBaseTokenInvoiceMutation } from 'src/graphql/mutations/__generated__/createBaseTokenInvoice.generated';
import { getErrorContent } from 'src/utils/error';
import { RequestModal } from 'src/views/home/account/pay/RequestModal';
import { chartColors } from 'src/styles/Themes';
import { FC, useEffect, useState } from 'react';

export const BuyButton: FC<{ paidCallback: (id: string) => void }> = ({
  children,
  paidCallback,
}) => {
  const [modalOpen, modalOpenSet] = useState<boolean>(false);
  const [invoice, invoiceSet] = useState<string>('');

  const [buy, { data, loading }] = useCreateBaseTokenInvoiceMutation({
    onError: err => toast.error(getErrorContent(err)),
  });

  useEffect(() => {
    if (loading || !data?.createBaseTokenInvoice) return;
    invoiceSet(data.createBaseTokenInvoice.request);
    modalOpenSet(true);
  }, [loading, data]);

  const handleReset = () => {
    invoiceSet('');
    modalOpenSet(false);
  };

  const handlePaidReset = () => {
    invoiceSet('');
    modalOpenSet(false);
    paidCallback(data?.createBaseTokenInvoice?.id || '');
  };

  return (
    <>
      <ColorButton
        loading={loading}
        disabled={loading}
        withMargin={'24px 0 0'}
        fullWidth={true}
        color={chartColors.green}
        onClick={buy}
      >
        {children}
      </ColorButton>
      <Modal isOpen={modalOpen} closeCallback={handleReset}>
        <RequestModal request={invoice} handleReset={handlePaidReset} />
      </Modal>
    </>
  );
};
