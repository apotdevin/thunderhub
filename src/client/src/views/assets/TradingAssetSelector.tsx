import { FC } from 'react';
import { Loader2 } from 'lucide-react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useGetTapSupportedAssetsQuery } from '../../graphql/queries/__generated__/getTapSupportedAssets.generated';
import {
  useTradingState,
  useTradingDispatch,
} from '../../context/TradingContext';

export const TradingAssetSelector: FC = () => {
  const { selectedAsset } = useTradingState();
  const dispatch = useTradingDispatch();

  const { data: supportedData, loading } = useGetTapSupportedAssetsQuery();

  const supportedAssets =
    supportedData?.rails?.get_tap_supported_assets?.list || [];

  const handleSelectAsset = (assetId: string) => {
    if (assetId === '__all__') {
      dispatch({ type: 'selectAsset', asset: null });
      return;
    }
    const asset = supportedAssets.find(a => a.id === assetId);
    if (asset) {
      dispatch({
        type: 'selectAsset',
        asset: {
          id: asset.id,
          symbol: asset.symbol,
          precision: asset.precision,
          assetId: asset.assetId,
          groupKey: asset.groupKey,
        },
      });
    }
  };

  if (loading) {
    return <Loader2 className="animate-spin text-muted-foreground" size={12} />;
  }

  return (
    <Select
      value={selectedAsset?.id || '__all__'}
      onValueChange={handleSelectAsset}
    >
      <SelectTrigger className="h-5 w-28 rounded text-[10px] border-none! bg-transparent! shadow-none! px-1.5 gap-1 font-medium text-muted-foreground hover:text-foreground focus:ring-0! focus-visible:ring-0! focus-visible:border-none!">
        <SelectValue />
      </SelectTrigger>
      <SelectContent position="popper" className="rounded-md">
        <SelectItem value="__all__">All assets</SelectItem>
        {supportedAssets.map(a => (
          <SelectItem key={a.id} value={a.id}>
            {a.symbol || a.id.slice(0, 8)}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
