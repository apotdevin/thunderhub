import { Card, CardContent } from '@/components/ui/card';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  NativeSelect,
  NativeSelectOption,
} from '@/components/ui/native-select';
import { useConfigState, useConfigDispatch } from '../../context/ConfigContext';
import { usePriceState, usePriceDispatch } from '../../context/PriceContext';

export const InterfaceSettings = () => {
  const { fiat, prices, dontShow } = usePriceState();
  const { theme, currency } = useConfigState();
  const dispatch = useConfigDispatch();
  const priceDispatch = usePriceDispatch();

  const fiatOptions = prices
    ? Object.entries(prices)
        .filter(([, v]) => v?.last && v?.symbol)
        .map(([key, v]) => ({
          key,
          label: `${key} (${v!.symbol} ${Number(v!.last).toLocaleString('en-US', { maximumFractionDigits: 0 })})`,
        }))
    : [];

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Interface</h2>
      <Card>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Theme</span>
            <ToggleGroup
              type="single"
              variant="outline"
              value={theme}
              onValueChange={v => {
                if (v) dispatch({ type: 'themeChange', theme: v });
              }}
            >
              <ToggleGroupItem value="light">Light</ToggleGroupItem>
              <ToggleGroupItem value="dark">Dark</ToggleGroupItem>
              <ToggleGroupItem value="system">System</ToggleGroupItem>
            </ToggleGroup>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Currency</span>
            <ToggleGroup
              type="single"
              variant="outline"
              value={currency}
              onValueChange={v => {
                if (v) dispatch({ type: 'change', currency: v });
              }}
            >
              <ToggleGroupItem value="sat">Satoshis</ToggleGroupItem>
              <ToggleGroupItem value="btc">Bitcoin</ToggleGroupItem>
              {!dontShow && (
                <ToggleGroupItem value="fiat">Fiat</ToggleGroupItem>
              )}
            </ToggleGroup>
          </div>
          {currency === 'fiat' && !dontShow && fiatOptions.length > 0 && (
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Fiat Currency</span>
              <NativeSelect
                value={fiat}
                onChange={e =>
                  priceDispatch({ type: 'change', fiat: e.target.value })
                }
              >
                {fiatOptions.map(opt => (
                  <NativeSelectOption key={opt.key} value={opt.key}>
                    {opt.label}
                  </NativeSelectOption>
                ))}
              </NativeSelect>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
