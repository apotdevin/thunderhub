import { Cable, Rocket } from 'lucide-react';
import { useState } from 'react';
import { OpenChannel } from './OpenChannel';
import { BuyChannel } from './BuyChannel';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
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
    <>
      <Card>
        <CardHeader>
          <CardTitle>Liquidity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid gap-3 md:grid-cols-2">
            <button
              className="flex cursor-pointer items-center justify-center gap-2 rounded border border-border bg-transparent p-3 text-primary transition-colors hover:border-primary"
              onClick={() => setOpenDialog('open')}
            >
              <Cable size={20} />
              <span className="text-sm text-muted-foreground">
                Open a Channel
              </span>
            </button>
            <button
              className="flex cursor-pointer items-center justify-center gap-2 rounded border border-border bg-transparent p-3 text-primary transition-colors hover:border-primary"
              onClick={() => setOpenDialog('buy')}
            >
              <Rocket size={20} />
              <span className="text-sm text-muted-foreground">
                Buy Inbound Liquidity
              </span>
            </button>
          </div>
        </CardContent>
      </Card>

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
    </>
  );
};
