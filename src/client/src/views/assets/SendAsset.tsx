import { FC, useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Loader2, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSendTapAssetMutation } from '../../graphql/mutations/__generated__/sendTapAsset.generated';
import { useDecodeTapAddressLazyQuery } from '../../graphql/queries/__generated__/decodeTapAddress.generated';
import { useGetTapBalancesQuery } from '../../graphql/queries/__generated__/getTapBalances.generated';
import { getErrorContent } from '../../utils/error';

export const SendAsset: FC = () => {
  const [address, setAddress] = useState('');
  const [decodeTimer, setDecodeTimer] = useState<ReturnType<
    typeof setTimeout
  > | null>(null);

  const [decodeAddr, { data: decoded, loading: decoding, error: decodeError }] =
    useDecodeTapAddressLazyQuery();

  const { data: balancesData } = useGetTapBalancesQuery({
    variables: { groupBy: 'groupKey' },
  });

  const nameMap = new Map(
    (balancesData?.getTapBalances?.balances || [])
      .filter(b => b.assetId || b.groupKey)
      .flatMap(b => {
        const entries: [string, string][] = [];
        if (b.assetId) entries.push([b.assetId, b.name || 'Unknown']);
        if (b.groupKey) entries.push([b.groupKey, b.name || 'Unknown']);
        return entries;
      })
  );

  const [sendAsset, { loading }] = useSendTapAssetMutation({
    onError: error => toast.error(getErrorContent(error)),
    onCompleted: () => {
      toast.success('Asset sent successfully');
      setAddress('');
    },
    refetchQueries: ['GetTapAssets', 'GetTapBalances', 'GetTapTransfers'],
  });

  useEffect(() => {
    if (decodeTimer) clearTimeout(decodeTimer);

    if (address.startsWith('tap') && address.length > 20) {
      const timer = setTimeout(() => {
        decodeAddr({ variables: { addr: address } });
      }, 500);
      setDecodeTimer(timer);
    }

    return () => {
      if (decodeTimer) clearTimeout(decodeTimer);
    };
  }, [address]);

  const handleSend = () => {
    if (!address) {
      toast.error('Address is required');
      return;
    }
    sendAsset({ variables: { tapAddrs: [address] } });
  };

  const addrInfo = decoded?.decodeTapAddress;

  return (
    <Card>
      <CardContent className="p-4">
        <h3 className="text-sm font-semibold mb-3">Send Asset</h3>
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-xs text-muted-foreground mb-1 block">
              Taproot Asset Address
            </label>
            <textarea
              value={address}
              onChange={e => setAddress(e.target.value.trim())}
              placeholder="taprt1..."
              rows={3}
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono resize-none"
            />
          </div>

          {decoding && (
            <div className="flex items-center gap-2 text-xs text-muted-foreground">
              <Loader2 className="h-3 w-3 animate-spin" />
              Decoding address...
            </div>
          )}

          {decodeError && address.length > 20 && (
            <div className="flex items-center gap-2 text-xs text-destructive">
              <Info size={12} />
              Invalid address
            </div>
          )}

          {addrInfo &&
            !decoding &&
            !decodeError &&
            (() => {
              const assetName =
                (addrInfo.groupKey && nameMap.get(addrInfo.groupKey)) ||
                (addrInfo.assetId && nameMap.get(addrInfo.assetId)) ||
                null;

              return (
                <div className="rounded-md bg-muted p-3 text-xs flex flex-col gap-1.5">
                  {assetName && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Asset</span>
                      <span className="font-semibold">{assetName}</span>
                    </div>
                  )}
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Amount</span>
                    <span className="font-semibold">{addrInfo.amount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type</span>
                    <span>{addrInfo.assetType || 'NORMAL'}</span>
                  </div>
                  {addrInfo.groupKey && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Group Key</span>
                      <span className="font-mono truncate max-w-[200px]">
                        {addrInfo.groupKey}
                      </span>
                    </div>
                  )}
                  {addrInfo.assetId && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Asset ID</span>
                      <span className="font-mono truncate max-w-[200px]">
                        {addrInfo.assetId}
                      </span>
                    </div>
                  )}
                </div>
              );
            })()}

          <Button
            onClick={handleSend}
            disabled={loading || !address || !!decodeError}
            size="sm"
          >
            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Send
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
