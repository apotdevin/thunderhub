import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { ChevronRight, X, Copy, Loader2 } from 'lucide-react';
import { useVerifyMessageLazyQuery } from '../../../graphql/queries/__generated__/verifyMessage.generated';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { getErrorContent } from '../../../utils/error';
import { getNodeLink } from '../../../components/generic/helpers';

export const VerifyMessage = () => {
  const [message, setMessage] = useState('');
  const [signature, setSignature] = useState('');
  const [isOpen, setIsOpen] = useState(false);
  const [signedBy, setSignedBy] = useState('');

  const [verifyMessage, { data, loading }] = useVerifyMessageLazyQuery({
    onError: error => toast.error(getErrorContent(error)),
  });

  useEffect(() => {
    if (!loading && data && data.verifyMessage) {
      setSignedBy(data.verifyMessage);
    }
  }, [loading, data]);

  return (
    <div className="space-y-3">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm font-medium">Verify Message</span>
          <p className="text-xs text-muted-foreground mt-0.5">
            Verify a message signature
          </p>
        </div>
        <Button
          variant="outline"
          size="sm"
          disabled={loading}
          onClick={() => setIsOpen(o => !o)}
        >
          {isOpen ? (
            <X size={14} />
          ) : (
            <>
              <span>Verify</span>
              <ChevronRight size={14} />
            </>
          )}
        </Button>
      </div>
      {isOpen && (
        <div className="space-y-2">
          <div className="grid grid-cols-[auto_1fr] gap-2 items-center">
            <label className="text-xs text-muted-foreground whitespace-nowrap">
              Message
            </label>
            <Input
              className="text-sm"
              placeholder="Enter message"
              onChange={e => setMessage(e.target.value)}
            />
            <label className="text-xs text-muted-foreground whitespace-nowrap">
              Signature
            </label>
            <Input
              className="text-sm"
              placeholder="Enter signature"
              onChange={e => setSignature(e.target.value)}
            />
          </div>
          <Button
            variant="outline"
            size="sm"
            className="w-full"
            disabled={message === '' || signature === '' || loading}
            onClick={() => verifyMessage({ variables: { message, signature } })}
          >
            {loading ? (
              <Loader2 className="animate-spin" size={14} />
            ) : (
              'Verify'
            )}
          </Button>
          {signedBy && (
            <div className="rounded border border-border bg-muted/50 p-3 text-center space-y-2">
              <p className="text-xs text-muted-foreground">Signed by</p>
              <div className="text-sm font-mono break-all">
                {getNodeLink(signedBy)}
              </div>
              <Button
                variant="outline"
                size="sm"
                onClick={() =>
                  navigator.clipboard
                    .writeText(signedBy)
                    .then(() => toast.success('Public Key Copied'))
                }
              >
                <Copy size={14} />
                Copy
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
