import { useState } from 'react';
import { Anchor, X, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card } from '../../../components/generic/Styled';
import { CreateInvoiceCard } from './createInvoice/CreateInvoice';
import { PayCard } from './pay/Payment';
import { ReceiveOnChainCard } from './receiveOnChain/ReceiveOnChain';
import { SendOnChainCard } from './sendOnChain/SendOnChain';

const SECTION_COLOR = '#FFD300';

export const AccountButtons = () => {
  const [state, setState] = useState<string>('none');

  const renderContent = () => {
    switch (state) {
      case 'send_ln':
        return <PayCard setOpen={() => setState('none')} />;
      case 'receive_ln':
        return <CreateInvoiceCard />;
      case 'send_chain':
        return <SendOnChainCard setOpen={() => setState('none')} />;
      case 'receive_chain':
        return <ReceiveOnChainCard />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="grid gap-2 grid-cols-2 md:grid-cols-4 mb-8">
        <Button
          variant={state === 'send_ln' ? 'default' : 'outline'}
          onClick={() => setState(state === 'send_ln' ? 'none' : 'send_ln')}
        >
          {state === 'send_ln' ? (
            <X size={18} color={SECTION_COLOR} />
          ) : (
            <Zap size={18} color={SECTION_COLOR} />
          )}
          Send
        </Button>
        <Button
          variant={state === 'receive_ln' ? 'default' : 'outline'}
          onClick={() =>
            setState(state === 'receive_ln' ? 'none' : 'receive_ln')
          }
        >
          {state === 'receive_ln' ? (
            <X size={18} color={SECTION_COLOR} />
          ) : (
            <Zap size={18} color={SECTION_COLOR} />
          )}
          Receive
        </Button>
        <Button
          variant={state === 'send_chain' ? 'default' : 'outline'}
          onClick={() =>
            setState(state === 'send_chain' ? 'none' : 'send_chain')
          }
        >
          {state === 'send_chain' ? (
            <X size={18} color={SECTION_COLOR} />
          ) : (
            <Anchor size={18} color={SECTION_COLOR} />
          )}
          Send
        </Button>
        <Button
          variant={state === 'receive_chain' ? 'default' : 'outline'}
          onClick={() =>
            setState(state === 'receive_chain' ? 'none' : 'receive_chain')
          }
        >
          {state === 'receive_chain' ? (
            <X size={18} color={SECTION_COLOR} />
          ) : (
            <Anchor size={18} color={SECTION_COLOR} />
          )}
          Receive
        </Button>
      </div>
      {state !== 'none' && <Card>{renderContent()}</Card>}
    </>
  );
};
