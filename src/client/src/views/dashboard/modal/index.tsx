import { useDashDispatch, useDashState } from '../../../context/DashContext';
import { CreateInvoiceCard } from '../../../views/home/account/createInvoice/CreateInvoice';
import { PayCard } from '../../../views/home/account/pay/Payment';
import { ReceiveOnChainCard } from '../../../views/home/account/receiveOnChain/ReceiveOnChain';
import { SendOnChainCard } from '../../../views/home/account/sendOnChain/SendOnChain';
import { SupportBar } from '../../../views/home/quickActions/donate/DonateContent';
import { SignMessage } from '../../../views/tools/messages/SignMessage';
import { OpenChannel } from '../../home/liquidity/OpenChannel';

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
            closeCbk={() => dispatch({ type: 'openModal', modalType: '' })}
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
