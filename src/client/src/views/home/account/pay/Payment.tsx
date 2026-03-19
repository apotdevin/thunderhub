import { useState } from 'react';
import { Switch } from '@/components/ui/switch';
import { Pay } from './Pay';
import { Keysend } from './KeysendModal';

export const PayCard = ({ setOpen }: { setOpen: () => void }) => {
  const [isKeysend, setIsKeysend] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-muted-foreground">
          Keysend
        </span>
        <Switch checked={isKeysend} onCheckedChange={setIsKeysend} />
      </div>
      {isKeysend ? (
        <Keysend payCallback={() => setOpen()} />
      ) : (
        <Pay payCallback={() => setOpen()} />
      )}
    </div>
  );
};
