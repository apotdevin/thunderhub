import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Switch } from '@/components/ui/switch';
import { Copy, Loader2, Plus } from 'lucide-react';
import { useBakeSuperMacaroonMutation } from '../../../graphql/mutations/__generated__/bakeSuperMacaroon.generated';
import { useGetCurrentNodeQuery } from '../../../graphql/queries/__generated__/getCurrentNode.generated';
import { useGetAccountQuery } from '../../../graphql/queries/__generated__/getAccount.generated';
import { useAddNodeMutation } from '../../../graphql/mutations/__generated__/addNode.generated';
import { GetUserNodesDocument } from '../../../graphql/queries/__generated__/getUserNodes.generated';
import toast from 'react-hot-toast';
import { getErrorContent } from '../../../utils/error';
import { useMutationResultWithReset } from '../../../hooks/UseMutationWithReset';
import Modal from '../../../components/modal/ReactModal';
import { shorten } from '../../../components/generic/helpers';

const deriveRestHost = (socket: string): string => {
  const cleaned = socket.replace(/^https?:\/\//, '');
  return `https://${cleaned}`;
};

export const SuperMacaroon = () => {
  const [newMacaroon, setNewMacaroon] = useState(false);
  const [restHost, setRestHost] = useState('');
  const [readOnly, setReadOnly] = useState(false);
  const [prefilled, setPrefilled] = useState(false);

  const { data: nodeData } = useGetCurrentNodeQuery();
  const { data: accountData } = useGetAccountQuery();

  const isDbUser = accountData?.getAccount?.type === 'db';

  const [addNode, { loading: addingNode }] = useAddNodeMutation({
    refetchQueries: [{ query: GetUserNodesDocument }],
    onCompleted: data => {
      toast.success(`Node "${data.team.add_node.name}" added`);
    },
    onError: err => toast.error(getErrorContent(err)),
  });

  useEffect(() => {
    if (nodeData?.node?.socket && !prefilled) {
      setRestHost(deriveRestHost(nodeData.node.socket));
      setPrefilled(true);
    }
  }, [nodeData, prefilled]);

  const [bake, { loading, data: _data }] = useBakeSuperMacaroonMutation({
    onCompleted: () => setNewMacaroon(true),
    onError: error => toast.error(getErrorContent(error)),
  });

  const [data, resetMutationResult] = useMutationResultWithReset(_data);

  const closeCallback = () => {
    setNewMacaroon(false);
    setRestHost('');
    setReadOnly(false);
    setPrefilled(false);
    resetMutationResult();
  };

  const handleBake = () => {
    if (!restHost.trim()) {
      toast.error('REST host is required');
      return;
    }
    bake({
      variables: {
        input: { rest_host: restHost.trim(), read_only: readOnly },
      },
    });
  };

  return (
    <>
      <div className="space-y-4">
        <p className="text-sm text-muted-foreground">
          Bake a super macaroon from your LITD node. This creates a macaroon
          with permissions across all LITD sub-servers (LND, tapd, lit). Uses
          the admin macaroon already configured for this node.
        </p>

        <div className="space-y-2">
          <label className="text-sm font-medium">LITD REST Host</label>
          <Input
            placeholder="https://your-litd-host:8443"
            value={restHost}
            onChange={e => setRestHost(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') handleBake();
            }}
          />
          <p className="text-xs text-muted-foreground">
            Pre-filled from your node&apos;s gRPC socket. Adjust the port if
            your LITD REST endpoint differs.
          </p>
        </div>

        <label className="flex items-center justify-between gap-2 py-1 cursor-pointer">
          <span
            className={`text-sm ${readOnly ? 'text-foreground font-medium' : 'text-muted-foreground'}`}
          >
            Read Only
          </span>
          <Switch checked={readOnly} onCheckedChange={setReadOnly} />
        </label>

        <Button
          className="w-full"
          onClick={handleBake}
          disabled={loading || !restHost.trim()}
        >
          {loading ? (
            <Loader2 className="animate-spin" size={14} />
          ) : (
            'Bake Super Macaroon'
          )}
        </Button>
      </div>

      <Modal
        isOpen={!!newMacaroon}
        closeCallback={closeCallback}
        title="Super Macaroon"
      >
        {data?.bakeSuperMacaroon && (
          <div className="space-y-3">
            <h3 className="text-sm font-semibold">Super Macaroon</h3>
            {[
              { label: 'Base64', value: data.bakeSuperMacaroon.base },
              { label: 'Hex', value: data.bakeSuperMacaroon.hex },
            ].map(({ label, value }) => (
              <div
                key={label}
                className="flex items-center gap-2 rounded border border-border bg-muted/50 px-3 py-2"
              >
                <span className="text-xs font-medium text-muted-foreground shrink-0">
                  {label}
                </span>
                <span className="text-xs font-mono break-all flex-1 truncate">
                  {shorten(value)}
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="shrink-0 h-7 w-7"
                  onClick={() =>
                    navigator.clipboard
                      .writeText(value)
                      .then(() => toast.success('Copied'))
                  }
                >
                  <Copy size={12} />
                </Button>
              </div>
            ))}

            {isDbUser && (
              <Button
                className="w-full"
                onClick={() =>
                  addNode({
                    variables: {
                      input: {
                        name: 'LiTD Node',
                        litd: {
                          socket: nodeData?.node?.socket ?? '',
                          macaroon: data.bakeSuperMacaroon!.hex,
                        },
                      },
                    },
                  })
                }
                disabled={addingNode}
              >
                {addingNode ? (
                  <Loader2 className="animate-spin" size={14} />
                ) : (
                  <>
                    <Plus size={14} />
                    Add LiTD Node to Account
                  </>
                )}
              </Button>
            )}
          </div>
        )}
      </Modal>
    </>
  );
};
