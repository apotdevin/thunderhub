import { useState } from 'react';
import { Anchor, X, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CreateInvoiceCard } from './createInvoice/CreateInvoice';
import { PayCard } from './pay/Payment';
import { ReceiveOnChainCard } from './receiveOnChain/ReceiveOnChain';
import { SendOnChainCard } from './sendOnChain/SendOnChain';

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

  const buttons = [
    { key: 'send_ln', label: 'Send', icon: Zap },
    { key: 'receive_ln', label: 'Receive', icon: Zap },
    { key: 'send_chain', label: 'Send', icon: Anchor },
    { key: 'receive_chain', label: 'Receive', icon: Anchor },
  ] as const;

  return (
    <>
      <div className="grid grid-cols-2 gap-2 md:grid-cols-4">
        {buttons.map(btn => {
          const active = state === btn.key;
          const Icon = btn.icon;
          return (
            <Button
              key={btn.key}
              variant={active ? 'default' : 'outline'}
              onClick={() => setState(active ? 'none' : btn.key)}
            >
              {active ? <X size={16} /> : <Icon size={16} />}
              {btn.label}
            </Button>
          );
        })}
      </div>
      {state !== 'none' && (
        <Card>
          <CardContent>{renderContent()}</CardContent>
        </Card>
      )}
    </>
  );
};
