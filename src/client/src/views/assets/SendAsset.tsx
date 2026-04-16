import { FC, useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { Loader2, Info } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { useSendTapAssetMutation } from '../../graphql/mutations/__generated__/sendTapAsset.generated';
import { useDecodeTapAddressLazyQuery } from '../../graphql/queries/__generated__/decodeTapAddress.generated';
import { useGetTapBalancesQuery } from '../../graphql/queries/__generated__/getTapBalances.generated';
import { useGetTapSupportedAssetsQuery } from '../../graphql/queries/__generated__/getTapSupportedAssets.generated';
import { TapBalanceGroupBy } from '../../graphql/types';
import { getErrorContent } from '../../utils/error';
import { atomicToDisplay } from './trade.helpers';

export const SendAsset: FC = () => {
  const [address, setAddress] = useState('');
  const decodeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const [decodeAddr, { data: decoded, loading: decoding, error: decodeError }] =
    useDecodeTapAddressLazyQuery();

  const { data: balancesData } = useGetTapBalancesQuery({
    variables: { group_by: TapBalanceGroupBy.GroupKey },
  });

  const { data: supportedData } = useGetTapSupportedAssetsQuery();

  const nameMap = new Map(
    (balancesData?.taproot_assets?.get_balances?.balances || [])
      .filter(b => b.asset_id || b.group_key)
      .flatMap(b => {
        const entries: [string, string][] = [];
        const label = b.names?.join(', ') || 'Unknown';
        if (b.asset_id) entries.push([b.asset_id, label]);
        if (b.group_key) entries.push([b.group_key, label]);
        return entries;
      })
  );

  const precisionMap = new Map<string, number>();
  for (const asset of supportedData?.rails?.get_tap_supported_assets?.list ||
    []) {
    if (asset.assetId) precisionMap.set(asset.assetId, asset.precision);
    if (asset.groupKey) precisionMap.set(asset.groupKey, asset.precision);
  }

  const [sendAsset, { loading }] = useSendTapAssetMutation({
    onError: error => toast.error(getErrorContent(error)),
    onCompleted: () => {
      toast.success('Asset sent successfully');
      setAddress('');
    },
    refetchQueries: ['GetTapAssets', 'GetTapBalances', 'GetTapTransfers'],
  });

  useEffect(() => {
    if (decodeTimerRef.current) clearTimeout(decodeTimerRef.current);

    if (address.startsWith('tap') && address.length > 20) {
      decodeTimerRef.current = setTimeout(() => {
        decodeAddr({ variables: { addr: address } });
      }, 50);
    }

    return () => {
      if (decodeTimerRef.current) clearTimeout(decodeTimerRef.current);
    };
  }, [address, decodeAddr]);

  const handleSend = () => {
    if (!address) {
      toast.error('Address is required');
      return;
    }
    sendAsset({ variables: { tap_addrs: [address] } });
  };

  const addrInfo = decoded?.taproot_assets?.decode_address;

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
                (addrInfo.group_key && nameMap.get(addrInfo.group_key)) ||
                (addrInfo.asset_id && nameMap.get(addrInfo.asset_id)) ||
                null;

              const precision =
                (addrInfo.asset_id
                  ? precisionMap.get(addrInfo.asset_id)
                  : undefined) ??
                (addrInfo.group_key
                  ? precisionMap.get(addrInfo.group_key)
                  : undefined) ??
                0;

              const displayAmount = atomicToDisplay(addrInfo.amount, precision);

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
                    <span className="font-semibold">{displayAmount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-muted-foreground">Type</span>
                    <span>{addrInfo.asset_type || 'NORMAL'}</span>
                  </div>
                  {addrInfo.group_key && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Group Key</span>
                      <span className="font-mono truncate max-w-[200px]">
                        {addrInfo.group_key}
                      </span>
                    </div>
                  )}
                  {addrInfo.asset_id && (
                    <div className="flex justify-between">
                      <span className="text-muted-foreground">Asset ID</span>
                      <span className="font-mono truncate max-w-[200px]">
                        {addrInfo.asset_id}
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
