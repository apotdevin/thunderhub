import { useState } from 'react';
import toast from 'react-hot-toast';
import { Radio, Copy, ChevronDown, ChevronUp } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { useGetNodeInfoQuery } from '../../../graphql/queries/__generated__/getNodeInfo.generated';
import { getErrorContent } from '../../../utils/error';
import { LoadingCard } from '../../../components/loading/LoadingCard';

export const ConnectCard = () => {
  const [open, openSet] = useState(false);

  const { loading, data } = useGetNodeInfoQuery({
    onError: error => toast.error(getErrorContent(error)),
  });

  if (!data || loading) {
    return <LoadingCard title={'Connect'} />;
  }

  const { public_key, uris } = data.getNodeInfo || {};

  const onionAddress = uris.find((uri: string) => uri.indexOf('onion') >= 0);
  const normalAddress = uris.find((uri: string) => uri.indexOf('onion') < 0);

  let clear: string | null = null;
  let tor: string | null = null;

  if (normalAddress) {
    clear = normalAddress.split('@')[1];
  }
  if (onionAddress) {
    tor = onionAddress.split('@')[1];
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Radio size={16} className="text-primary" />
            <CardTitle>Connect</CardTitle>
          </div>
          <div className="flex gap-2">
            {onionAddress && (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  navigator.clipboard
                    .writeText(onionAddress)
                    .then(() => toast.success('Onion Address Copied'))
                }
              >
                <Copy size={14} />
                Onion
              </Button>
            )}
            {normalAddress && (
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  navigator.clipboard
                    .writeText(normalAddress)
                    .then(() => toast.success('Public Address Copied'))
                }
              >
                <Copy size={14} />
                IP
              </Button>
            )}
            <Button
              variant="outline"
              size="sm"
              onClick={() => openSet(s => !s)}
            >
              {open ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="break-all text-xs text-muted-foreground font-mono">
          {public_key}
        </div>
      </CardContent>
      {open && (
        <>
          <Separator />
          <CardContent>
            <div className="flex flex-col gap-2">
              <div className="flex flex-col gap-0.5">
                <span className="text-xs text-muted-foreground">
                  Public Key
                </span>
                <span className="break-all text-sm font-mono">
                  {public_key}
                </span>
              </div>
              {clear && (
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground">IP</span>
                  <span className="break-all text-sm font-mono">{clear}</span>
                </div>
              )}
              {tor && (
                <div className="flex flex-col gap-0.5">
                  <span className="text-xs text-muted-foreground">TOR</span>
                  <span className="break-all text-sm font-mono">{tor}</span>
                </div>
              )}
            </div>
          </CardContent>
        </>
      )}
    </Card>
  );
};
