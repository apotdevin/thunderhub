import { Switch } from '@/components/ui/switch';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from '@/components/ui/card';
import {
  useNotificationDispatch,
  useNotificationState,
} from '../../context/NotificationContext';

export const NotificationSettings = () => {
  const { channels, forwardAttempts, forwards, invoices, payments, autoClose } =
    useNotificationState();

  const dispatch = useNotificationDispatch();

  const handleToggle = (property: string, value: boolean) =>
    dispatch({ type: 'change', [property]: value });

  const items = [
    { label: 'Invoices', property: 'invoices', value: invoices },
    { label: 'Payments', property: 'payments', value: payments },
    { label: 'Channels', property: 'channels', value: channels },
    { label: 'Forwards', property: 'forwards', value: forwards },
    {
      label: 'Forward Attempts',
      property: 'forwardAttempts',
      value: forwardAttempts,
    },
    { label: 'Auto Close', property: 'autoClose', value: autoClose },
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle>Notifications</CardTitle>
        <CardDescription>
          Choose which events trigger notifications
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
