import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Decoded } from './Decoded';

export const DecodeCard = () => {
  const [request, setRequest] = useState('');
  const [show, setShow] = useState(false);

  return (
    <div className="flex flex-col gap-3">
      {!show && (
        <>
          <div className="flex flex-col gap-1">
            <label className="text-xs font-medium text-muted-foreground">
              Request
            </label>
            <Input
              placeholder="Lightning Invoice"
              value={request}
              onChange={e => setRequest(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            disabled={request === ''}
            onClick={() => setShow(true)}
          >
            Decode <ChevronRight size={18} />
          </Button>
        </>
      )}
      {show && <Decoded request={request} setShow={setShow} />}
    </div>
  );
};
