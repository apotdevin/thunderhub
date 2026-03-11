import { useState } from 'react';
import {
  Card,
  Sub4Title,
  ResponsiveLine,
} from '../../../../components/generic/Styled';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Decoded } from './Decoded';
import { cn } from '@/lib/utils';

export const DecodeCard = () => {
  const [request, setRequest] = useState('');
  const [show, setShow] = useState(false);

  return (
    <Card bottom={'20px'}>
      {!show && (
        <ResponsiveLine>
          <Sub4Title>Request:</Sub4Title>
          <Input
            placeholder={'Lightning Invoice'}
            style={{ margin: '0 0 0 24px' }}
            value={request}
            onChange={e => setRequest(e.target.value)}
          />
          <Button
            variant="outline"
            disabled={request === ''}
            style={{ margin: '0 0 0 16px' }}
            className={cn('w-full md:w-auto')}
            onClick={() => {
              setShow(true);
            }}
          >
            Decode <ChevronRight size={18} />
          </Button>
        </ResponsiveLine>
      )}
      {show && <Decoded request={request} setShow={setShow} />}
    </Card>
  );
};
