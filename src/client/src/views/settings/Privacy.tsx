import { Switch } from '@/components/ui/switch';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import { useConfigState, useConfigDispatch } from '../../context/ConfigContext';

export const PrivacySettings = () => {
  const { fetchFees, fetchPrices, displayValues } = useConfigState();
  const dispatch = useConfigDispatch();

  const handleToggle = (type: string, value: boolean) => {
    localStorage.setItem(type, JSON.stringify(value));
    dispatch({ type: 'change', [type]: value });
  };

  const items = [
    {
      label: 'Fetch Bitcoin Fees',
      property: 'fetchFees',
      value: fetchFees,
    },
    {
      label: 'Fetch Fiat Prices',
      property: 'fetchPrices',
      value: fetchPrices,
    },
    {
      label: 'Display Values',
      property: 'displayValues',
      value: displayValues,
    },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Privacy</CardTitle>
        <CardDescription>
          Control what data is fetched and displayed
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {items.map(item => (
          <div
            key={item.property}
            className="flex items-center justify-between"
          >
            <span className="text-sm font-medium">{item.label}</span>
            <Switch
              checked={item.value}
              onCheckedChange={checked => handleToggle(item.property, checked)}
            />
          </div>
        ))}
      </CardContent>
    </Card>
  );
};
