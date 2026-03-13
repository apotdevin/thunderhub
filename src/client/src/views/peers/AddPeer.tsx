import { useState } from 'react';
import { Plus, X, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';
import { useAddPeerMutation } from '../../graphql/mutations/__generated__/addPeer.generated';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { getErrorContent } from '../../utils/error';

export const AddPeer = () => {
  const [isAdding, setIsAdding] = useState(false);
  const [temp, setTemp] = useState(false);
  const [separate, setSeparate] = useState(false);
  const [url, setUrl] = useState('');
  const [key, setKey] = useState('');
  const [socket, setSocket] = useState('');

  const [addPeer, { loading }] = useAddPeerMutation({
    onError: error => toast.error(getErrorContent(error)),
    onCompleted: () => {
      toast.success('Peer added successfully');
      setIsAdding(false);
      setTemp(false);
      setUrl('');
      setKey('');
      setSocket('');
    },
    refetchQueries: ['GetPeers'],
  });

  const canSubmit = url !== '' || (socket !== '' && key !== '');

  return (
    <div className="flex flex-col w-full">
      <h4 className="my-[5px] font-medium text-foreground">Add Peer</h4>
      <div className="bg-card shadow-[0_8px_16px_-8px_rgba(0,0,0,0.1)] rounded border border-border w-full p-4 mb-[25px]">
        <div className="flex justify-between items-center">
          <p className="text-sm text-muted-foreground">
            Connect to a new Lightning Network peer
          </p>
          <Button
            variant={isAdding ? 'ghost' : 'outline'}
            size="sm"
            onClick={() => setIsAdding(prev => !prev)}
          >
            {isAdding ? (
              <X size={16} />
            ) : (
              <>
                <Plus size={16} className="mr-1" /> Add
              </>
            )}
          </Button>
        </div>

        {isAdding && (
          <>
            <Separator className="my-4" />

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <label className="text-sm font-medium min-w-[80px]">
                  Format
                </label>
                <div className="flex rounded-md bg-secondary p-0.5">
                  <Button
                    variant={!separate ? 'default' : 'ghost'}
                    size="sm"
                    className="text-xs"
                    onClick={() => {
                      setKey('');
                      setSocket('');
                      setSeparate(false);
                    }}
                  >
                    Combined
                  </Button>
                  <Button
                    variant={separate ? 'default' : 'ghost'}
                    size="sm"
                    className="text-xs"
                    onClick={() => {
                      setUrl('');
                      setSeparate(true);
                    }}
                  >
                    Separate
                  </Button>
                </div>
              </div>

              {!separate ? (
                <div className="space-y-1.5">
                  <label className="text-sm font-medium">
                    Connection String
                  </label>
                  <Input
                    value={url}
                    onChange={e => setUrl(e.target.value)}
                    placeholder="public_key@host:port"
                  />
                </div>
              ) : (
                <div className="grid gap-3 sm:grid-cols-2">
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Public Key</label>
                    <Input
                      value={key}
                      onChange={e => setKey(e.target.value)}
                      placeholder="02abc..."
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-sm font-medium">Socket</label>
                    <Input
                      value={socket}
                      onChange={e => setSocket(e.target.value)}
                      placeholder="host:port"
                    />
                  </div>
                </div>
              )}

              <div className="flex items-center justify-between">
                <div className="space-y-0.5">
                  <label className="text-sm font-medium">Temporary</label>
                  <p className="text-xs text-muted-foreground">
                    Peer will not be reconnected on restart
                  </p>
                </div>
                <Switch checked={temp} onCheckedChange={setTemp} />
              </div>

              <Button
                onClick={() =>
                  addPeer({
                    variables: {
                      url,
                      publicKey: key,
                      socket,
                      isTemporary: temp,
                    },
                  })
                }
                disabled={!canSubmit || loading}
                className="w-full"
              >
                {loading ? (
                  <Loader2 className="animate-spin" size={16} />
                ) : (
                  'Add Peer'
                )}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};
