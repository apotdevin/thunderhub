import { useState, ReactNode } from 'react';
import toast from 'react-hot-toast';
import { Info, Loader2 } from 'lucide-react';
import { getErrorContent } from '@/utils/error';
import { AddNodeInput } from '@/graphql/types';
import { useAddNodeMutation } from '@/graphql/mutations/__generated__/addNode.generated';
import { GetUserNodesDocument } from '@/graphql/queries/__generated__/getUserNodes.generated';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '@/components/ui/tooltip';

type NodeType = 'lnd' | 'litd';

// shadcn TooltipContent is `inline-flex` with column gaps, so multi-child
// content gets laid out as separate flex columns. Wrapping the body in a
// single <p> keeps it as one flex item so text wraps normally.
const FieldHint = ({ children }: { children: ReactNode }) => (
  <Tooltip>
    <TooltipTrigger asChild>
      <button
        type="button"
        aria-label="More info"
        className="inline-flex shrink-0 text-muted-foreground/60 hover:text-muted-foreground"
      >
        <Info size={12} />
      </button>
    </TooltipTrigger>
    <TooltipContent>
      <p className="max-w-65 text-left leading-snug">{children}</p>
    </TooltipContent>
  </Tooltip>
);

const Field = ({
  id,
  label,
  hint,
  children,
}: {
  id: string;
  label: ReactNode;
  hint: ReactNode;
  children: ReactNode;
}) => (
  <div className="flex flex-col gap-1.5">
    <label
      htmlFor={id}
      className="flex items-center gap-1.5 text-xs font-medium text-muted-foreground"
    >
      {label}
      <FieldHint>{hint}</FieldHint>
    </label>
    {children}
  </div>
);

const macaroonHint = (type: NodeType) =>
  type === 'litd'
    ? 'LiTD nodes require a super admin macaroon. The regular admin macaroon will not authenticate against LiTD.'
    : 'Paste your admin macaroon as hex or base64. If your node runs LiTD, switch the node type tab above. LiTD requires a super admin macaroon instead.';

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

    const input: AddNodeInput = {
      name,
      [type]: { socket, macaroon, cert: cert || undefined },
    };

    addNode({ variables: { input } });
  };

  const macaroonLabel =
    type === 'litd' ? 'Super Admin Macaroon' : 'Admin Macaroon';

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

      <Field
        id="node-name"
        label="Node Name"
        hint="Pick a label for this node inside ThunderHub. It is only used in this dashboard and has no relation to the LND alias broadcast on the network."
      >
        <Input
          id="node-name"
          autoFocus
          placeholder="My Lightning Node"
          value={name}
          onChange={e => setName(e.target.value)}
        />
      </Field>

      <Field
        id="node-socket"
        label="Socket"
        hint="Format is host:port. For Voltage nodes, use the API endpoint and gRPC port shown in the dashboard."
      >
        <Input
          id="node-socket"
          placeholder="host:port"
          value={socket}
          onChange={e => setSocket(e.target.value)}
        />
      </Field>

      <Field id="node-macaroon" label={macaroonLabel} hint={macaroonHint(type)}>
        <Input
          id="node-macaroon"
          placeholder="Hex or base64 encoded"
          value={macaroon}
          onChange={e => setMacaroon(e.target.value)}
        />
      </Field>

      <Field
        id="node-cert"
        label={
          <>
            TLS Certificate{' '}
            <span className="text-muted-foreground/60">(optional)</span>
          </>
        }
        hint="Leave blank for Voltage nodes as they use a CA-signed certificate, so providing one here will cause the connection to fail."
      >
        <Input
          id="node-cert"
          placeholder="Hex or base64 encoded"
          value={cert}
          onChange={e => setCert(e.target.value)}
        />
      </Field>

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
