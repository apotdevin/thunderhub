import { useState } from 'react';
import { Anchor, ArrowUpRight, ArrowDownLeft, Zap } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { CreateInvoiceCard } from './createInvoice/CreateInvoice';
import { PayCard } from './pay/Payment';
import { ReceiveOnChainCard } from './receiveOnChain/ReceiveOnChain';
import { SendOnChainCard } from './sendOnChain/SendOnChain';

type ActiveState =
  | 'none'
  | 'send_ln'
  | 'receive_ln'
  | 'send_chain'
  | 'receive_chain';

const ActionSection = ({
  label,
  icon: Icon,
  iconClassName,
  sendKey,
  receiveKey,
  active,
  onToggle,
}: {
  label: string;
  icon: typeof Zap;
  iconClassName?: string;
  sendKey: ActiveState;
  receiveKey: ActiveState;
  active: ActiveState;
  onToggle: (key: ActiveState) => void;
}) => (
  <div className="flex items-center justify-between rounded-lg bg-card py-4 px-4 ring-1 ring-foreground/10 text-card-foreground">
    <div className="flex items-center gap-2">
      <Icon size={14} className={iconClassName} />
      <span className="text-sm font-medium">{label}</span>
    </div>
    <div className="flex items-center gap-2">
      <Button
        variant={active === sendKey ? 'default' : 'outline'}
        size="sm"
        className="text-xs"
        onClick={() => onToggle(sendKey)}
      >
        <ArrowUpRight size={14} />
        Send
      </Button>
      <Button
        variant={active === receiveKey ? 'default' : 'outline'}
        size="sm"
        className="text-xs"
        onClick={() => onToggle(receiveKey)}
      >
        <ArrowDownLeft size={14} />
        Receive
      </Button>
    </div>
  </div>
);

export const AccountButtons = () => {
  const [state, setState] = useState<ActiveState>('none');

  const toggle = (key: ActiveState) => {
    setState(prev => (prev === key ? 'none' : key));
  };

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
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <ActionSection
          label="Lightning"
          icon={Zap}
          iconClassName="text-yellow-500 fill-yellow-500"
          sendKey="send_ln"
          receiveKey="receive_ln"
          active={state}
          onToggle={toggle}
        />
        <ActionSection
          label="On-chain"
          icon={Anchor}
          iconClassName="text-yellow-500"
          sendKey="send_chain"
          receiveKey="receive_chain"
          active={state}
          onToggle={toggle}
        />
      </div>
      {state !== 'none' && (
        <Card>
          <CardContent>{renderContent()}</CardContent>
        </Card>
      )}
    </>
  );
};
