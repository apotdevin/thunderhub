import { useState } from 'react';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { getErrorContent } from '@/utils/error';
import { AddNodeInput } from '@/graphql/types';
import { useAddNodeMutation } from '@/graphql/mutations/__generated__/addNode.generated';
import { GetUserNodesDocument } from '@/graphql/queries/__generated__/getUserNodes.generated';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';

type NodeType = 'lnd' | 'litd';

interface AddNodeFormProps {
  onNodeAdded: (slug: string) => void;
}

export const AddNodeForm = ({ onNodeAdded }: AddNodeFormProps) => {
  const [type, setType] = useState<NodeType>('lnd');
  const [name, setName] = useState('');
  const [socket, setSocket] = useState('');
  const [macaroon, setMacaroon] = useState('');
  const [cert, setCert] = useState('');

  const [addNode, { loading }] = useAddNodeMutation({
    refetchQueries: [{ query: GetUserNodesDocument }],
    onCompleted: data => {
      const slug = data.team.add_node.slug;
      onNodeAdded(slug);
    },
    onError: err => {
      toast.error(getErrorContent(err));
    },
  });

  const handleSubmit = () => {
    if (!name || !socket || !macaroon || loading) return;

    const connectionInput = {
      socket,
      macaroon,
      cert: cert || undefined,
    };

    const input: AddNodeInput = {
      name,
      [type]: connectionInput,
    };

    addNode({ variables: { input } });
  };

  return (
    <div className="flex flex-col gap-3">
      <div className="flex flex-col gap-1.5">
        <label className="text-xs font-medium text-muted-foreground">
          Node Type
        </label>
        <Tabs value={type} onValueChange={v => setType(v as NodeType)}>
          <TabsList className="w-full">
            <TabsTrigger value="lnd" className="flex-1">
              LND
            </TabsTrigger>
            <TabsTrigger value="litd" className="flex-1">
              LiTD
            </TabsTrigger>
          </TabsList>
        </Tabs>
      </div>
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="node-name"
          className="text-xs font-medium text-muted-foreground"
        >
          Node Name
        </label>
        <Input
          id="node-name"
          autoFocus
          placeholder="My Lightning Node"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="node-socket"
          className="text-xs font-medium text-muted-foreground"
        >
          Socket
        </label>
        <Input
          id="node-socket"
          placeholder="host:port"
          value={socket}
          onChange={e => setSocket(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="node-macaroon"
          className="text-xs font-medium text-muted-foreground"
        >
          Admin Macaroon
        </label>
        <Input
          id="node-macaroon"
          placeholder="Hex or base64 encoded"
          value={macaroon}
          onChange={e => setMacaroon(e.target.value)}
        />
      </div>
      <div className="flex flex-col gap-1.5">
        <label
          htmlFor="node-cert"
          className="text-xs font-medium text-muted-foreground"
        >
          TLS Certificate{' '}
          <span className="text-muted-foreground/60">(optional)</span>
        </label>
        <Input
          id="node-cert"
          placeholder="Hex or base64 encoded"
          value={cert}
          onChange={e => setCert(e.target.value)}
        />
      </div>
      <Button
        disabled={!name || !socket || !macaroon || loading}
        onClick={handleSubmit}
        className="mt-1 w-full"
      >
        {loading ? (
          <Loader2 className="animate-spin" size={16} />
        ) : (
          'Connect Node'
        )}
      </Button>
    </div>
  );
};
