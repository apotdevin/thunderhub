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
        <div className="flex gap-2">
          <Input
            className="flex-1"
            placeholder="Lightning Invoice"
            value={request}
            onChange={e => setRequest(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && request && setShow(true)}
          />
          <Button
            variant="outline"
            disabled={request === ''}
            onClick={() => setShow(true)}
          >
            Decode <ChevronRight size={18} />
          </Button>
        </div>
      )}
      {show && <Decoded request={request} setShow={setShow} />}
    </div>
  );
};
