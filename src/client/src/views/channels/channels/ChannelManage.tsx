import { useState } from 'react';
import { DetailsChange } from '../../../components/details/detailsChange';
import { X, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { OpenChannel } from '../../home/liquidity/OpenChannel';

type WindowState = 'none' | 'open' | 'details';

export const ChannelManage = () => {
  const [openWindow, setOpenWindow] = useState<WindowState>('none');

  const toggle = (target: WindowState) =>
    setOpenWindow(prev => (prev === target ? 'none' : target));

  return (
    <div className="flex flex-col gap-3 rounded border border-border bg-card p-4">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium">Open Channel</span>
        <Button variant="outline" size="sm" onClick={() => toggle('open')}>
          {openWindow === 'open' ? (
            <X className="size-4" />
          ) : (
            <>
              Open
              <ChevronRight className="ml-1 size-4" />
            </>
          )}
        </Button>
      </div>

      {openWindow === 'open' && (
        <>
          <Separator />
          <OpenChannel closeCbk={() => setOpenWindow('none')} />
        </>
      )}

      {openWindow !== 'open' && (
        <>
          <Separator />
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium">Change Channel Details</span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => toggle('details')}
            >
              {openWindow === 'details' ? (
                <X className="size-4" />
              ) : (
                <>
                  Change
                  <ChevronRight className="ml-1 size-4" />
                </>
              )}
            </Button>
          </div>
        </>
      )}

      {openWindow === 'details' && (
        <>
          <Separator />
          <DetailsChange />
        </>
      )}
    </div>
  );
};
