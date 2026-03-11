import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  Card,
  CardWithTitle,
  SingleLine,
  SubTitle,
} from '../../components/generic/Styled';
import { VFC } from 'react';
import {
  useNotificationDispatch,
  useNotificationState,
} from '../../context/NotificationContext';

const Toggle: VFC<{
  title: string;
  property: string;
  value: boolean;
  cbk: (fields: any) => void;
}> = ({ title, property, value, cbk }) => {
  return (
    <SingleLine>
      <div className="whitespace-nowrap text-sm">{title}</div>
      <div className="flex justify-center items-center rounded-md p-1 bg-secondary flex-wrap">
        <Button
          variant={value ? 'default' : 'ghost'}
          onClick={() => cbk({ [property]: true })}
          className={cn('grow', !value && 'text-foreground')}
        >
          Yes
        </Button>
        <Button
          variant={!value ? 'default' : 'ghost'}
          onClick={() => cbk({ [property]: false })}
          className={cn('grow', value && 'text-foreground')}
        >
          No
        </Button>
      </div>
    </SingleLine>
  );
};

export const NotificationSettings = () => {
  const { channels, forwardAttempts, forwards, invoices, payments, autoClose } =
    useNotificationState();

  const dispatch = useNotificationDispatch();

  const handleToggle = (fields: any) => dispatch({ type: 'change', ...fields });

  return (
    <CardWithTitle>
      <SubTitle>Notifications</SubTitle>
      <Card>
        <Toggle
          title="Invoices"
          property="invoices"
          value={invoices}
          cbk={handleToggle}
        />
        <Toggle
          title="Payments"
          property="payments"
          value={payments}
          cbk={handleToggle}
        />
        <Toggle
          title="Channels"
          property="channels"
          value={channels}
          cbk={handleToggle}
        />
        <Toggle
          title="Forwards"
          property="forwards"
          value={forwards}
          cbk={handleToggle}
        />
        <Toggle
          title="Forward Attempts"
          property="forwardAttempts"
          value={forwardAttempts}
          cbk={handleToggle}
        />
        <Toggle
          title="Auto Close"
          property="autoClose"
          value={autoClose}
          cbk={handleToggle}
        />
      </Card>
    </CardWithTitle>
  );
};
