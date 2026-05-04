import { Switch } from '@/components/ui/switch';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { useLocalStorage } from '../../hooks/UseLocalStorage';
import { TradeDisplayMode } from './tradeMemo';

export const defaultSettings = {
  rebalance: false,
  confirmed: true,
  tradeDisplayMode: 'computed' as TradeDisplayMode,
};

export const TransactionSettings = () => {
  const [settings, setSettings] = useLocalStorage(
    'transactionSettings',
    defaultSettings
  );

  const { rebalance, confirmed, tradeDisplayMode } = settings;

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-3">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-medium">Trade Metadata</span>
          <span className="text-[11px] text-muted-foreground">
            Switch between raw node memos and ThunderHub-computed labels
          </span>
        </div>
        <ToggleGroup
          type="single"
          variant="outline"
          size="sm"
          value={tradeDisplayMode}
          onValueChange={value =>
            value &&
            setSettings({
              ...settings,
              tradeDisplayMode: value as TradeDisplayMode,
            })
          }
        >
          <ToggleGroupItem value="computed">Computed</ToggleGroupItem>
          <ToggleGroupItem value="raw">Raw</ToggleGroupItem>
        </ToggleGroup>
      </div>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-medium">Show Confirmed Only</span>
          <span className="text-[11px] text-muted-foreground">
            Hide unconfirmed transactions
          </span>
        </div>
        <Switch
          checked={confirmed}
          onCheckedChange={v => setSettings({ ...settings, confirmed: v })}
        />
      </div>
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-0.5">
          <span className="text-xs font-medium">Hide Circular Payments</span>
          <span className="text-[11px] text-muted-foreground">
            Filter out rebalance payments
          </span>
        </div>
        <Switch
          checked={rebalance}
          onCheckedChange={v => setSettings({ ...settings, rebalance: v })}
        />
      </div>
    </div>
  );
};
