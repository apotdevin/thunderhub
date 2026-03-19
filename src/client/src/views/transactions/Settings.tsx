import { Switch } from '@/components/ui/switch';
import { useLocalStorage } from '../../hooks/UseLocalStorage';

export const defaultSettings = {
  rebalance: false,
  confirmed: true,
};

export const TransactionSettings = () => {
  const [settings, setSettings] = useLocalStorage(
    'transactionSettings',
    defaultSettings
  );

  const { rebalance, confirmed } = settings;

  return (
    <div className="flex flex-col gap-3">
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
