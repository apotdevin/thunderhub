import { useState } from 'react';
import { Wallet, Zap, Anchor, Cable, Rocket } from 'lucide-react';
import { Price } from '../../components/price/Price';
import { useNodeBalances } from '../../hooks/UseNodeBalances';
import { OpenChannel } from '../../views/home/liquidity/OpenChannel';
import { BuyChannel } from '../../views/home/liquidity/BuyChannel';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../../components/ui/dialog';
import Big from 'big.js';

type DialogState = 'none' | 'open' | 'buy';

export const BalancesContent = () => {
  const { onchain, lightning } = useNodeBalances();
  const [openDialog, setOpenDialog] = useState<DialogState>('none');

  const totalChain = new Big(onchain.confirmed).add(onchain.pending).toString();
  const totalLightning = new Big(lightning.confirmed)
    .add(lightning.pending)
    .toString();
  const totalBalance = new Big(totalChain).add(totalLightning).toString();

  const activeLightning = new Big(lightning.active)
    .sub(lightning.commit)
    .toString();
  const inactiveLightning = new Big(lightning.confirmed)
    .sub(lightning.active)
    .add(lightning.commit)
    .toString();

  const chainPending = Number(onchain.pending) + Number(onchain.closing);
  const channelPending = Number(lightning.pending);

  return (
    <div className="flex flex-col">
      <div className="p-2 border-b-border/60 border-b">
        <div className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60 mb-2">
          Balances
        </div>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
            <Wallet size={13} />
            <span className="font-medium">Total</span>
          </div>
          <div className="text-sm font-medium text-foreground">
            <Price amount={totalBalance} />
          </div>
        </div>
      </div>

      <div className="p-2 border-b-border/60 border-b">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Zap
                size={13}
                className={
                  channelPending === 0
                    ? 'text-yellow-500 fill-yellow-500'
                    : 'text-purple-500 fill-purple-500'
                }
              />
              <span className="font-medium">Lightning</span>
            </div>
            <div className="text-sm font-medium text-foreground">
              <Price amount={totalLightning} />
            </div>
          </div>
          <div className="flex flex-col gap-0.5 pl-5 mt-1 text-[11px] text-muted-foreground/70">
            <div className="flex justify-between">
              <span>Available</span>
              <Price amount={activeLightning} />
            </div>
            <div className="flex justify-between">
              <span>Not Available</span>
              <Price amount={inactiveLightning} />
            </div>
            <div className="flex justify-between">
              <span>Pending</span>
              <Price amount={lightning.pending} />
            </div>
          </div>
        </div>
      </div>

      <div className="p-2 border-b-border/60 border-b">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <Anchor
                size={13}
                className={
                  chainPending === 0 ? 'text-yellow-500' : 'text-purple-500'
                }
              />
              <span className="font-medium">Bitcoin</span>
            </div>
            <div className="text-sm font-medium text-foreground">
              <Price amount={totalChain} />
            </div>
          </div>
          <div className="flex flex-col gap-0.5 pl-5 mt-1 text-[11px] text-muted-foreground/70">
            <div className="flex justify-between">
              <span>Available</span>
              <Price amount={onchain.confirmed} />
            </div>
            <div className="flex justify-between">
              <span>Pending</span>
              <Price amount={onchain.pending} />
            </div>
            <div className="flex justify-between">
              <span>Force Closures</span>
              <Price amount={onchain.closing} />
            </div>
          </div>
        </div>
      </div>

      <div>
        <div className="p-2 text-[10px] font-semibold uppercase tracking-wider text-muted-foreground/60">
          Liquidity
        </div>
        <div className="flex flex-col pb-2">
          <button
            className="flex items-center gap-2 w-full px-2 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-accent/50"
            onClick={() => setOpenDialog('open')}
          >
            <Cable size={13} className="text-blue-500" />
            Open Channel
          </button>
          <button
            className="flex items-center gap-2 w-full px-2 py-1.5 text-xs font-medium text-muted-foreground transition-colors hover:text-foreground hover:bg-accent/50"
            onClick={() => setOpenDialog('buy')}
          >
            <Rocket size={13} className="text-orange-500" />
            Buy Inbound Liquidity
          </button>
        </div>
      </div>

      <Dialog
        open={openDialog === 'open'}
        onOpenChange={open => !open && setOpenDialog('none')}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Open Channel</DialogTitle>
            <DialogDescription>
              Open a new payment channel with a Lightning Network peer.
            </DialogDescription>
          </DialogHeader>
          <OpenChannel closeCbk={() => setOpenDialog('none')} />
        </DialogContent>
      </Dialog>

      <Dialog
        open={openDialog === 'buy'}
        onOpenChange={open => !open && setOpenDialog('none')}
      >
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle>Buy Inbound Liquidity</DialogTitle>
            <DialogDescription>
              Get inbound capacity so you can start receiving payments
              instantly.
            </DialogDescription>
          </DialogHeader>
          <BuyChannel />
        </DialogContent>
      </Dialog>
    </div>
  );
};
