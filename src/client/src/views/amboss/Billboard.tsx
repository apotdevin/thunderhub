import { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { Link } from '../../components/link/Link';
import { Price } from '../../components/price/Price';
import { useKeysendMutation } from '../../graphql/mutations/__generated__/keysend.generated';
import toast from 'react-hot-toast';
import { getErrorContent } from '../../utils/error';

const AMBOSS_PUBKEY =
  '03006fcf3312dae8d068ea297f58e2bd00ec1ffe214b793eda46966b6294a53ce6';

export const Billboard = () => {
  const [message, setMessage] = useState('');
  const [tokens, setTokens] = useState(100);
  const [confirming, setConfirming] = useState(false);

  const [keysend, { loading }] = useKeysendMutation({
    onError: error => toast.error(getErrorContent(error)),
    onCompleted: () => {
      toast.success('Message sent to Amboss Billboard');
      setMessage('');
      setTokens(0);
      setConfirming(false);
    },
    refetchQueries: ['GetNodeInfo', 'GetBalances'],
  });

  const canSend = tokens > 0 && message.trim().length > 0;

  const handlePay = () => {
    if (loading || !canSend) return;
    keysend({
      variables: {
        destination: AMBOSS_PUBKEY,
        tokens,
        message: message.trim(),
      },
    });
  };

  return (
    <div className="flex flex-col gap-4">
      <h2 className="text-lg font-semibold">Keysend Billboard</h2>
      <Card>
        <CardContent className="space-y-3">
          <p className="text-sm text-muted-foreground">
            Send a message to the{' '}
            <Link
              href={`https://amboss.space/node/${AMBOSS_PUBKEY}`}
              newTab={true}
            >
              Amboss
            </Link>{' '}
            billboard. Messages are sorted by amount of sats sent and how recent
            it was.
          </p>
          {!confirming ? (
            <div className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-xs font-medium text-muted-foreground">
                  Message
                </label>
                <Textarea
                  placeholder="Write your message..."
                  value={message}
                  onChange={e => setMessage(e.target.value)}
                  rows={2}
                />
              </div>
              <div className="flex items-end gap-2">
                <div className="flex flex-1 flex-col gap-1">
                  <label className="text-xs font-medium text-muted-foreground">
                    Amount (sats)
                  </label>
                  <Input
                    placeholder="0"
                    type="number"
                    value={tokens && tokens > 0 ? tokens : ''}
                    onChange={e => setTokens(Number(e.target.value))}
                    onKeyDown={e => {
                      if (e.key === 'Enter' && canSend) setConfirming(true);
                    }}
                  />
                </div>
                <Button
                  variant="outline"
                  disabled={!canSend}
                  onClick={() => setConfirming(true)}
                >
                  Send
                </Button>
              </div>
            </div>
          ) : (
            <div className="flex flex-col gap-2">
              <div className="divide-y divide-border rounded border border-border text-xs">
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-muted-foreground">Message</span>
                  <span className="max-w-62.5 truncate font-medium">
                    {message}
                  </span>
                </div>
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-muted-foreground">Amount</span>
                  <span className="font-medium">
                    <Price amount={tokens} />
                  </span>
                </div>
                <div className="flex items-center justify-between px-3 py-2">
                  <span className="text-muted-foreground">Destination</span>
                  <span className="font-medium">Amboss.Space</span>
                </div>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setConfirming(false)}
                >
                  Cancel
                </Button>
                <Button
                  className="flex-1"
                  disabled={!canSend || loading}
                  onClick={handlePay}
                >
                  {loading ? (
                    <Loader2 className="animate-spin" size={14} />
                  ) : (
                    'Confirm Send'
                  )}
                </Button>
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};
