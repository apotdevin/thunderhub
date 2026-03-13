import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { ChevronRight, X, Loader2, TriangleAlert } from 'lucide-react';
import { useRecoverFundsLazyQuery } from '../../../graphql/queries/__generated__/recoverFunds.generated';
import { getErrorContent } from '../../../utils/error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const RecoverFunds = () => {
  const [backupString, setBackupString] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const [recoverFunds, { data, loading }] = useRecoverFundsLazyQuery({
    onError: error => toast.error(getErrorContent(error)),
  });

  useEffect(() => {
    if (!loading && data && data.recoverFunds) {
      toast.success('Recovery Successful');
    }
  }, [data, loading]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm font-medium text-destructive">
            Recover Funds
          </span>
          <p className="text-xs text-muted-foreground mt-0.5">
            Force close all channels and recover on-chain funds
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          className="border-destructive/50 text-destructive hover:bg-destructive/10"
          disabled={loading}
          onClick={() => setIsOpen(o => !o)}
        >
          {isOpen ? (
            <X size={14} />
          ) : (
            <>
              <span>Recover</span>
              <ChevronRight size={14} />
            </>
          )}
        </Button>
      </div>
      {isOpen && (
        <div className="space-y-3">
          <div className="flex items-start gap-2 rounded border border-destructive/30 bg-destructive/5 p-3 text-xs text-destructive">
            <TriangleAlert size={14} className="mt-0.5 shrink-0" />
            <span>
              This will force close all channels from the backup. Only use this
              if your node is unrecoverable and you need to sweep funds
              on-chain.
            </span>
          </div>
          <div className="flex gap-2">
            <Input
              placeholder="Paste backup string"
              className="text-sm"
              onChange={e => setBackupString(e.target.value)}
            />
            <Button
              variant="destructive"
              size="sm"
              disabled={backupString === '' || loading}
              onClick={() =>
                recoverFunds({ variables: { backup: backupString } })
              }
            >
              {loading ? (
                <Loader2 className="animate-spin" size={14} />
              ) : (
                'Recover'
              )}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
};
