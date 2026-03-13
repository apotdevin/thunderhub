import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { ChevronRight, X, Loader2 } from 'lucide-react';
import { useVerifyBackupsLazyQuery } from '../../../graphql/queries/__generated__/verifyBackups.generated';
import { getErrorContent } from '../../../utils/error';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

export const VerifyBackups = () => {
  const [backupString, setBackupString] = useState('');
  const [isOpen, setIsOpen] = useState(false);

  const [verifyBackup, { data, loading }] = useVerifyBackupsLazyQuery({
    onError: error => toast.error(getErrorContent(error)),
  });

  useEffect(() => {
    if (!loading && data && data.verifyBackups) {
      toast.success('Valid Backup String');
    }
    if (!loading && data && !data.verifyBackups) {
      toast.error('Invalid Backup String');
    }
  }, [data, loading]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm font-medium">Verify All Channels</span>
          <p className="text-xs text-muted-foreground mt-0.5">
            Validate an exported channel backup
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          disabled={loading}
          onClick={() => setIsOpen(o => !o)}
        >
          {isOpen ? (
            <X size={14} />
          ) : (
            <>
              <span>Verify</span>
              <ChevronRight size={14} />
            </>
          )}
        </Button>
      </div>
      {isOpen && (
        <div className="flex gap-2">
          <Input
            placeholder="Paste backup content"
            className="text-sm"
            onChange={e => setBackupString(e.target.value)}
          />
          <Button
            variant="outline"
            size="sm"
            disabled={backupString === '' || loading}
            onClick={() =>
              verifyBackup({ variables: { backup: backupString } })
            }
          >
            {loading ? (
              <Loader2 className="animate-spin" size={14} />
            ) : (
              'Verify'
            )}
          </Button>
        </div>
      )}
    </div>
  );
};
