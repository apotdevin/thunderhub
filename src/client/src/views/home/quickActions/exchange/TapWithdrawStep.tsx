import { FC, useState, useEffect, useRef } from 'react';
import toast from 'react-hot-toast';
import { ChevronLeft, Info, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { useSendTapAssetMutation } from '../../../../graphql/mutations/__generated__/sendTapAsset.generated';
import { useDecodeTapAddressLazyQuery } from '../../../../graphql/queries/__generated__/decodeTapAddress.generated';
import { useGetTapBalancesQuery } from '../../../../graphql/queries/__generated__/getTapBalances.generated';
import { useGetTapSupportedAssetsQuery } from '../../../../graphql/queries/__generated__/getTapSupportedAssets.generated';
import { TapBalanceGroupBy } from '../../../../graphql/types';
import { getErrorContent } from '../../../../utils/error';
import { atomicToDisplay } from '../../../assets/trade.helpers';

export const TapWithdrawStep: FC<{
  onBack?: () => void;
  onClose?: () => void;
}> = ({ onBack, onClose }) => {
  const [address, setAddress] = useState('');
  const [confirming, setConfirming] = useState(false);
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
      if (onClose) {
        onClose();
      } else {
        setAddress('');
        setConfirming(false);
      }
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

  const getDecodedInfo = () => {
    if (!addrInfo) return null;

    const assetName =
      (addrInfo.group_key && nameMap.get(addrInfo.group_key)) ||
      (addrInfo.asset_id && nameMap.get(addrInfo.asset_id)) ||
      null;

    const precision =
      (addrInfo.asset_id ? precisionMap.get(addrInfo.asset_id) : undefined) ??
      (addrInfo.group_key ? precisionMap.get(addrInfo.group_key) : undefined) ??
      0;

    const displayAmount = atomicToDisplay(addrInfo.amount, precision);

    return { assetName, displayAmount };
  };

  const info = !decoding && !decodeError ? getDecodedInfo() : null;

  return (
    <div className="flex flex-col gap-3">
      {onBack && (
        <Button
          variant="ghost"
          size="sm"
          className="self-start -ml-2"
          onClick={onBack}
        >
          <ChevronLeft size={14} />
          Back
        </Button>
      )}

      <div className="flex flex-col gap-1">
        <label className="text-xs font-medium text-muted-foreground">
          Taproot Asset Address
        </label>
        <textarea
          value={address}
          onChange={e => {
            setAddress(e.target.value.trim());
            setConfirming(false);
          }}
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

      {info && addrInfo && (
        <div className="divide-y divide-border rounded border border-border text-xs">
          {info.assetName && (
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-muted-foreground">Asset</span>
              <span className="font-medium">{info.assetName}</span>
            </div>
          )}
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-muted-foreground">Amount</span>
            <span className="font-medium">{info.displayAmount}</span>
          </div>
          <div className="flex items-center justify-between px-3 py-2">
            <span className="text-muted-foreground">Type</span>
            <span className="font-medium">
              {addrInfo.asset_type || 'NORMAL'}
            </span>
          </div>
          {addrInfo.group_key && (
            <div className="flex items-center justify-between px-3 py-2">
              <span className="text-muted-foreground">Group Key</span>
              <span className="font-mono truncate max-w-50 text-[11px]">
                {addrInfo.group_key}
              </span>
            </div>
          )}
        </div>
      )}

      <Separator />

      {!confirming ? (
        <Button
          variant="outline"
          disabled={loading || !address || !!decodeError}
          className="w-full"
          onClick={() => setConfirming(true)}
        >
          Send
        </Button>
      ) : (
        <div className="flex gap-2">
          <Button
            variant="outline"
            className="flex-1"
            onClick={() => setConfirming(false)}
          >
            Cancel
          </Button>
          <Button
            className="flex-1"
            disabled={loading || !address || !!decodeError}
            onClick={handleSend}
          >
            {loading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              'Confirm Send'
            )}
          </Button>
        </div>
      )}
    </div>
  );
};
