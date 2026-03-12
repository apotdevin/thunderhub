import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
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
        <div className="flex justify-center items-center rounded-md p-1 bg-secondary flex-wrap">
          <Button
            variant={confirmed ? 'default' : 'ghost'}
            onClick={() => setSettings({ ...settings, confirmed: true })}
            className={cn('grow', !confirmed && 'text-foreground')}
          >
            Yes
          </Button>
          <Button
            variant={!confirmed ? 'default' : 'ghost'}
            onClick={() => setSettings({ ...settings, confirmed: false })}
            className={cn('grow', confirmed && 'text-foreground')}
          >
            No
          </Button>
        </div>
      </SingleLine>
      <SingleLine>
        <div className="whitespace-nowrap text-sm">Circular Payment</div>
        <div
          className="flex justify-center items-center rounded-md p-1 bg-secondary flex-wrap"
          style={{ margin: '8px 0' }}
        >
          <Button
            variant={rebalance ? 'default' : 'ghost'}
            onClick={() => setSettings({ ...settings, rebalance: true })}
            className={cn('grow', !rebalance && 'text-foreground')}
          >
            Yes
          </Button>
          <Button
            variant={!rebalance ? 'default' : 'ghost'}
            onClick={() => setSettings({ ...settings, rebalance: false })}
            className={cn('grow', rebalance && 'text-foreground')}
          >
            No
          </Button>
        </div>
      </SingleLine>
    </>
  );
};
