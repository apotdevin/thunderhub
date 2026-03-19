import { Button } from '@/components/ui/button';
import { useDashDispatch } from '../../../../context/DashContext';

export const PayInvoice = () => {
  const dispatch = useDashDispatch();

  return (
    <Button
      variant="outline"
      className="w-full"
      onClick={() => dispatch({ type: 'openModal', modalType: 'payInvoice' })}
    >
      Pay Invoice
    </Button>
  );
};

export const CreateInvoice = () => {
  const dispatch = useDashDispatch();

  return (
    <Button
      variant="outline"
      className="w-full"
      onClick={() =>
        dispatch({ type: 'openModal', modalType: 'createInvoice' })
      }
    >
      Create Invoice
    </Button>
  );
};

export const SendOnChain = () => {
  const dispatch = useDashDispatch();

  return (
    <Button
      variant="outline"
      className="w-full"
      onClick={() => dispatch({ type: 'openModal', modalType: 'sendChain' })}
    >
      Send Bitcoin
    </Button>
  );
};

export const ReceiveOnChain = () => {
  const dispatch = useDashDispatch();

  return (
    <Button
      variant="outline"
      className="w-full"
      onClick={() => dispatch({ type: 'openModal', modalType: 'receiveChain' })}
    >
      Receive Bitcoin
    </Button>
  );
};

export const OpenChannel = () => {
  const dispatch = useDashDispatch();

  return (
    <Button
      variant="outline"
      className="w-full"
      onClick={() => dispatch({ type: 'openModal', modalType: 'openChannel' })}
    >
      Open Channel
    </Button>
  );
};
