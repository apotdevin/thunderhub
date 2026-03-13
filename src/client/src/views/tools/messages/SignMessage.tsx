import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { ChevronRight, X, Copy, Loader2 } from 'lucide-react';
import { useSignMessageLazyQuery } from '../../../graphql/queries/__generated__/signMessage.generated';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getErrorContent } from '../../../utils/error';

export const SignMessage = () => {
  const [message, setMessage] = useState('');
  const [signed, setSigned] = useState('');

  const [signMessage, { data, loading }] = useSignMessageLazyQuery({
    onError: error => toast.error(getErrorContent(error)),
  });

  useEffect(() => {
    if (!loading && data && data.signMessage) {
      setSigned(data.signMessage);
    }
  }, [loading, data]);

  return (
    <div className="space-y-2">
      <div className="flex gap-2">
        <Input
          className="text-sm"
          placeholder="Enter message to sign"
          onChange={e => setMessage(e.target.value)}
        />
        <Button
          variant="outline"
          size="sm"
          disabled={message === '' || loading}
          onClick={() => signMessage({ variables: { message } })}
        >
          {loading ? <Loader2 className="animate-spin" size={14} /> : 'Sign'}
        </Button>
      </div>
      {signed && (
        <div className="rounded border border-border bg-muted/50 p-3 text-center space-y-2">
          <p className="text-xs text-muted-foreground">Signature</p>
          <div className="text-sm font-mono break-all">{signed}</div>
          <Button
            variant="outline"
            size="sm"
            onClick={() =>
              navigator.clipboard
                .writeText(signed)
                .then(() => toast.success('Signature Copied'))
            }
          >
            <Copy size={14} />
            Copy
          </Button>
        </div>
      )}
    </div>
  );
};

export const SignMessageCard = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm font-medium">Sign Message</span>
          <p className="text-xs text-muted-foreground mt-0.5">
            Sign a message with your node key
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setIsOpen(o => !o)}>
          {isOpen ? (
            <X size={14} />
          ) : (
            <>
              <span>Sign</span>
              <ChevronRight size={14} />
            </>
          )}
        </Button>
      </div>
      {isOpen && <SignMessage />}
    </div>
  );
};
