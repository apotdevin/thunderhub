import { useState } from 'react';
import { ArrowUpRight, ArrowDownLeft } from 'lucide-react';
import { AssetsList } from './AssetsList';
import { PortfolioDistribution } from './PortfolioDistribution';
import { TapWithdrawStep } from '../home/quickActions/exchange/TapWithdrawStep';
import { TapDepositStep } from '../home/quickActions/exchange/TapDepositStep';
import { Button } from '../../components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../../components/ui/dialog';

export const AssetsView = () => {
  const [openDialog, setOpenDialog] = useState<'send' | 'receive' | null>(null);

  return (
    <div className="flex flex-col gap-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <h2 className="text-lg font-semibold">Taproot Assets</h2>
        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOpenDialog('send')}
          >
            <ArrowUpRight className="mr-1 size-4" />
            Send
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setOpenDialog('receive')}
          >
            <ArrowDownLeft className="mr-1 size-4" />
            Receive
          </Button>
        </div>
      </div>

      <PortfolioDistribution />
      <AssetsList />

      <Dialog
        open={openDialog === 'send'}
        onOpenChange={open => !open && setOpenDialog(null)}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Send Asset</DialogTitle>
            <DialogDescription>
              Send a Taproot Asset to a recipient.
            </DialogDescription>
          </DialogHeader>
          <TapWithdrawStep />
        </DialogContent>
      </Dialog>

      <Dialog
        open={openDialog === 'receive'}
        onOpenChange={open => !open && setOpenDialog(null)}
      >
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Receive Asset</DialogTitle>
            <DialogDescription>
              Generate an invoice to receive a Taproot Asset.
            </DialogDescription>
          </DialogHeader>
          <TapDepositStep />
        </DialogContent>
      </Dialog>
    </div>
  );
};
