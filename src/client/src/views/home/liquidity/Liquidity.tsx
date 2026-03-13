import {
  CardTitle,
  CardWithTitle,
  SubTitle,
} from '../../../components/generic/Styled';
import { ArrowDownRight, ArrowUpRight } from 'lucide-react';
import { useState } from 'react';
import { OpenChannel } from './OpenChannel';
import { BuyChannel, GoToMagma } from './BuyChannel';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';

type DialogState = 'none' | 'open' | 'buy';

export const Liquidity = () => {
  const [openDialog, setOpenDialog] = useState<DialogState>('none');

  return (
    <CardWithTitle>
      <CardTitle>
        <SubTitle>Liquidity</SubTitle>
        {openDialog === 'buy' && <GoToMagma />}
      </CardTitle>

      <div className="grid md:grid-cols-2 gap-4 my-4">
        <div
          className="bg-card shadow-[0_8px_16px_-8px_rgba(0,0,0,0.1)] rounded border border-border flex justify-center items-center p-2.5 cursor-pointer text-primary gap-2 hover:border-primary"
          onClick={() => setOpenDialog('open')}
        >
          <ArrowUpRight size={24} />
          <div className="text-sm text-muted-foreground text-center">
            Open a Channel
          </div>
        </div>
        <div
          className="bg-card shadow-[0_8px_16px_-8px_rgba(0,0,0,0.1)] rounded border border-border flex justify-center items-center p-2.5 cursor-pointer text-primary gap-2 hover:border-primary"
          onClick={() => setOpenDialog('buy')}
        >
          <ArrowDownRight size={24} />
          <div className="text-sm text-muted-foreground text-center">
            Buy Inbound Liquidity
          </div>
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
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Buy Inbound Liquidity</DialogTitle>
            <DialogDescription>
              Purchase inbound capacity to receive payments on your node.
            </DialogDescription>
          </DialogHeader>
          <BuyChannel />
        </DialogContent>
      </Dialog>
    </CardWithTitle>
  );
};
