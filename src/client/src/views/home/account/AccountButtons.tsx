import { useState, type ReactNode } from 'react';
import { Anchor, ArrowUpRight, ArrowDownLeft, Zap, Cable } from 'lucide-react';
import Big from 'big.js';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Price } from '@/components/price/Price';
import { useNodeBalances } from '@/hooks/UseNodeBalances';
import { CreateInvoiceCard } from './createInvoice/CreateInvoice';
import { PayCard } from './pay/Payment';
import { ReceiveOnChainCard } from './receiveOnChain/ReceiveOnChain';
import { SendOnChainCard } from './sendOnChain/SendOnChain';
import { OpenChannel } from '../liquidity/OpenChannel';

type ActiveState =
  | 'none'
  | 'send_ln'
  | 'receive_ln'
  | 'send_chain'
  | 'receive_chain'
  | 'open_channel';

const WalletCard = ({
  label,
  subtitle,
  balance,
  icon: Icon,
  iconClassName,
  iconBgClassName,
  accentClassName,
  gradientClassName,
  hoverClass,
  sendKey,
  receiveKey,
  active,
  onToggle,
  extraButtons,
}: {
  label: string;
  subtitle: string;
  balance: string;
  icon: typeof Zap;
  iconClassName?: string;
  iconBgClassName?: string;
  accentClassName?: string;
  gradientClassName?: string;
  hoverClass?: string;
  sendKey: ActiveState;
  receiveKey: ActiveState;
  active: ActiveState;
  onToggle: (key: ActiveState) => void;
  extraButtons?: ReactNode;
}) => {
  const btnBase =
    'cursor-pointer rounded-full px-4 w-full justify-start transition-all duration-150';

  return (
    <div
      className={cn(
        'relative overflow-hidden rounded-xl bg-card p-5 ring-1 ring-foreground/[0.06] shadow-sm shadow-black/[0.04] dark:shadow-none dark:ring-foreground/10 text-card-foreground transition-all duration-200',
        accentClassName
      )}
    >
      {/* Background gradient glow */}
      <div
        className={cn(
          'pointer-events-none absolute -top-10 -left-10 h-40 w-40 rounded-full opacity-30 blur-3xl dark:opacity-20',
          gradientClassName
        )}
      />
      <div className="relative flex items-center justify-between gap-4">
        {/* Left: icon + balance */}
        <div className="flex flex-col gap-2 min-w-0">
          <div className="flex items-center gap-2.5">
            <div
              className={cn(
                'flex items-center justify-center size-9 rounded-full shrink-0',
                iconBgClassName
              )}
            >
              <Icon size={16} className={iconClassName} />
            </div>
            <span className="text-sm font-semibold tracking-tight">
              {label}
            </span>
          </div>
          <div className="pl-0.5">
            <div className="text-2xl font-bold tracking-tight">
              <Price amount={balance} />
            </div>
            <span className="text-xs text-muted-foreground">{subtitle}</span>
          </div>
        </div>

        {/* Right: stacked buttons */}
        <div className="flex flex-col gap-1.5 shrink-0">
          <Button
            variant={active === sendKey ? 'default' : 'outline'}
            size="sm"
            className={cn(btnBase, active !== sendKey && hoverClass)}
            onClick={() => onToggle(sendKey)}
          >
            <ArrowUpRight size={14} />
            Send
          </Button>
          <Button
            variant={active === receiveKey ? 'default' : 'outline'}
            size="sm"
            className={cn(btnBase, active !== receiveKey && hoverClass)}
            onClick={() => onToggle(receiveKey)}
          >
            <ArrowDownLeft size={14} />
            Receive
          </Button>
          {extraButtons}
        </div>
      </div>
    </div>
  );
};

export const AccountButtons = () => {
  const [state, setState] = useState<ActiveState>('none');
  const { onchain, lightning } = useNodeBalances();

  const totalChain = new Big(onchain.confirmed).add(onchain.pending).toString();
  const totalLightning = new Big(lightning.confirmed)
    .add(lightning.pending)
    .toString();

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
      case 'open_channel':
        return <OpenChannel closeCbk={() => setState('none')} />;
      default:
        return null;
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <WalletCard
          label="Lightning Wallet"
          subtitle="Available Balance"
          balance={totalLightning}
          icon={Zap}
          iconClassName="text-violet-600 fill-violet-600 dark:text-violet-400 dark:fill-violet-400"
          iconBgClassName="bg-violet-500/10"
          accentClassName="border-t-2 border-t-violet-500/40"
          gradientClassName="bg-violet-500"
          hoverClass="hover:border-violet-500/40 hover:shadow-[0_0_10px_-3px] hover:shadow-violet-500/25"
          sendKey="send_ln"
          receiveKey="receive_ln"
          active={state}
          onToggle={toggle}
          extraButtons={
            <Button
              variant={state === 'open_channel' ? 'default' : 'outline'}
              size="sm"
              className={cn(
                'cursor-pointer rounded-full px-4 w-full justify-start transition-all duration-150',
                state !== 'open_channel' &&
                  'hover:border-violet-500/40 hover:shadow-[0_0_10px_-3px] hover:shadow-violet-500/25'
              )}
              onClick={() => toggle('open_channel')}
            >
              <Cable size={14} />
              Open Channel
            </Button>
          }
        />
        <WalletCard
          label="On-chain Wallet"
          subtitle="Total Balance"
          balance={totalChain}
          icon={Anchor}
          iconClassName="text-amber-600 dark:text-amber-400"
          iconBgClassName="bg-amber-500/10"
          accentClassName="border-t-2 border-t-amber-500/40"
          gradientClassName="bg-amber-500"
          hoverClass="hover:border-amber-500/40 hover:shadow-[0_0_10px_-3px] hover:shadow-amber-500/25"
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
