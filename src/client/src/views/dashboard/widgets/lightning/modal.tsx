import { ColorButton } from '../../../../components/buttons/colorButton/ColorButton';
import { useDashDispatch } from '../../../../context/DashContext';

export const PayInvoice = () => {
  const dispatch = useDashDispatch();

  return (
    <ColorButton
      fullWidth={true}
      onClick={() => dispatch({ type: 'openModal', modalType: 'payInvoice' })}
    >
      Pay Invoice
    </ColorButton>
  );
};

export const CreateInvoice = () => {
  const dispatch = useDashDispatch();

  return (
    <ColorButton
      fullWidth={true}
      onClick={() =>
        dispatch({ type: 'openModal', modalType: 'createInvoice' })
      }
    >
      Create Invoice
    </ColorButton>
  );
};

export const SendOnChain = () => {
  const dispatch = useDashDispatch();

  return (
    <ColorButton
      fullWidth={true}
      onClick={() => dispatch({ type: 'openModal', modalType: 'sendChain' })}
    >
      Send Bitcoin
    </ColorButton>
  );
};

export const ReceiveOnChain = () => {
  const dispatch = useDashDispatch();

  return (
    <ColorButton
      fullWidth={true}
      onClick={() => dispatch({ type: 'openModal', modalType: 'receiveChain' })}
    >
      Receive Bitcoin
    </ColorButton>
  );
};

export const OpenChannel = () => {
  const dispatch = useDashDispatch();

  return (
    <ColorButton
      fullWidth={true}
      onClick={() => dispatch({ type: 'openModal', modalType: 'openChannel' })}
    >
      Open Channel
    </ColorButton>
  );
};
