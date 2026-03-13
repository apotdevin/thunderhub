import { Switch } from '@/components/ui/switch';
import { SingleLine } from '../../components/generic/Styled';
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
    <>
      <SingleLine>
        <div className="whitespace-nowrap text-sm">Confirmed</div>
        <Switch
          checked={confirmed}
          onCheckedChange={v => setSettings({ ...settings, confirmed: v })}
        />
      </SingleLine>
      <SingleLine>
        <div className="whitespace-nowrap text-sm">Circular Payment</div>
        <Switch
          checked={rebalance}
          onCheckedChange={v => setSettings({ ...settings, rebalance: v })}
        />
      </SingleLine>
    </>
  );
};
