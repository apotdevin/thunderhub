import { useDashDispatch, useDashState } from 'src/context/DashContext';
import { CreateInvoiceCard } from 'src/views/home/account/createInvoice/CreateInvoice';
import { PayCard } from 'src/views/home/account/pay/Payment';
import { ReceiveOnChainCard } from 'src/views/home/account/receiveOnChain/ReceiveOnChain';
import { SendOnChainCard } from 'src/views/home/account/sendOnChain/SendOnChain';
import { SupportBar } from 'src/views/home/quickActions/donate/DonateContent';
import { OpenChannel } from 'src/views/home/quickActions/openChannel';
import { SignMessage } from 'src/views/tools/messages/SignMessage';

export const DashboardModal = () => {
  const { modalType } = useDashState();
  const dispatch = useDashDispatch();

  const renderModal = () => {
    switch (modalType) {
      case 'payInvoice':
        return (
          <PayCard
            setOpen={() => dispatch({ type: 'openModal', modalType: '' })}
          />
        );
      case 'createInvoice':
        return <CreateInvoiceCard color={'#FFD300'} />;
      case 'sendChain':
        return (
          <SendOnChainCard
            setOpen={() => dispatch({ type: 'openModal', modalType: '' })}
          />
        );
      case 'receiveChain':
        return <ReceiveOnChainCard />;
      case 'openChannel':
        return (
          <OpenChannel
            setOpenCard={() => dispatch({ type: 'openModal', modalType: '' })}
          />
        );
      case 'donate':
        return <SupportBar />;
      case 'signMessage':
        return <SignMessage />;
      default:
        return null;
    }
  };

  return renderModal();
};
