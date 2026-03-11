import { Sun, Moon } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import {
  useConfigDispatch,
  useConfigState,
} from '../../../../context/ConfigContext';

export const ThemeSetting = () => {
  const { theme } = useConfigState();
  const dispatch = useConfigDispatch();

  const handleDispatch = (theme: string) =>
    dispatch({ type: 'themeChange', theme });

  return (
    <div className="overflow-auto w-full h-full flex flex-wrap">
      <Button
        variant={theme === 'light' ? 'default' : 'ghost'}
        onClick={() => handleDispatch('light')}
        className={cn('grow', theme !== 'light' && 'text-foreground')}
      >
        <Sun size={16} />
      </Button>
      <Button
        variant={theme === 'dark' ? 'default' : 'ghost'}
        onClick={() => handleDispatch('dark')}
        className={cn('grow', theme !== 'dark' && 'text-foreground')}
      >
        <Moon size={16} />
      </Button>
    </div>
  );
};

export const CurrencySetting = () => {
  const { currency } = useConfigState();
  const dispatch = useConfigDispatch();

  const handleDispatch = (currency: string) =>
    dispatch({ type: 'change', currency });

  return (
    <div className="overflow-auto w-full h-full flex flex-wrap">
      <Button
        variant={currency === 'sat' ? 'default' : 'ghost'}
        onClick={() => handleDispatch('sat')}
        className={cn('grow', currency !== 'sat' && 'text-foreground')}
      >
        Sat
      </Button>
      <Button
        variant={currency === 'btc' ? 'default' : 'ghost'}
        onClick={() => handleDispatch('btc')}
        className={cn('grow', currency !== 'btc' && 'text-foreground')}
      >
        Btc
      </Button>
      <Button
        variant={currency === 'fiat' ? 'default' : 'ghost'}
        onClick={() => handleDispatch('fiat')}
        className={cn('grow', currency !== 'fiat' && 'text-foreground')}
      >
        Fiat
      </Button>
    </div>
  );
};
