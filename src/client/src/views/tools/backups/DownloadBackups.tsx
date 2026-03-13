import { useEffect } from 'react';
import toast from 'react-hot-toast';
import { useGetBackupsLazyQuery } from '../../../graphql/queries/__generated__/getBackups.generated';
import { format } from 'date-fns';
import { useNodeInfo } from '../../../hooks/UseNodeInfo';
import { saveToPc } from '../../../utils/helpers';
import { getErrorContent } from '../../../utils/error';
import { Button } from '@/components/ui/button';
import { Download, Loader2 } from 'lucide-react';

export const DownloadBackups = () => {
  const [getBackups, { data, loading }] = useGetBackupsLazyQuery({
    onError: error => toast.error(getErrorContent(error)),
  });

  const { publicKey } = useNodeInfo();

  useEffect(() => {
    if (loading || !data?.getBackups) return;

    const date = format(new Date(), 'ddMMyyyyhhmmss');
    saveToPc(data.getBackups, `ChannelBackup-${publicKey}-${date}`);
    localStorage.setItem(`lastBackup-${publicKey}`, new Date().toString());
    toast.success('Downloaded');
  }, [data, loading, publicKey]);

  return (
    <div className="flex items-center justify-between">
      <div>
        <span className="text-sm font-medium">Download All Channels</span>
        <p className="text-xs text-muted-foreground mt-0.5">
          Export a backup file for all channels
        </p>
      </div>
      <Button
        variant="outline"
        size="sm"
        disabled={loading}
        onClick={() => getBackups()}
      >
        {loading ? (
          <Loader2 className="animate-spin" size={14} />
        ) : (
          <>
            <Download size={14} />
            Download
          </>
        )}
      </Button>
    </div>
  );
};
