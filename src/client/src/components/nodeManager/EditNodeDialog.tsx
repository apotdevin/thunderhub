import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';
import { getErrorContent } from '@/utils/error';
import { useEditNodeMutation } from '@/graphql/mutations/__generated__/editNode.generated';
import { GetUserNodesDocument } from '@/graphql/queries/__generated__/getUserNodes.generated';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';

interface EditNodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  node: { slug: string; name: string } | null;
}

export const EditNodeDialog = ({
  open,
  onOpenChange,
  node,
}: EditNodeDialogProps) => {
  const [name, setName] = useState('');

  useEffect(() => {
    if (node) {
      setName(node.name);
    }
  }, [node]);

  const [editNode, { loading }] = useEditNodeMutation({
    refetchQueries: [{ query: GetUserNodesDocument }],
    onCompleted: () => {
      toast.success('Node updated');
      onOpenChange(false);
    },
    onError: err => {
      toast.error(getErrorContent(err));
    },
  });

  const handleSubmit = () => {
    if (!node || !name.trim() || loading) return;

    editNode({
      variables: {
        input: { slug: node.slug, name: name.trim() },
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Edit Node</DialogTitle>
          <DialogDescription>Update your node details.</DialogDescription>
        </DialogHeader>
        <div className="flex flex-col gap-3">
          <div className="flex flex-col gap-1.5">
            <label
              htmlFor="edit-node-name"
              className="text-xs font-medium text-muted-foreground"
            >
              Node Name
            </label>
            <Input
              id="edit-node-name"
              autoFocus
              placeholder="My Lightning Node"
              value={name}
              onChange={e => setName(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter') handleSubmit();
              }}
            />
          </div>
          <Button
            disabled={!name.trim() || loading}
            onClick={handleSubmit}
            className="mt-1 w-full"
          >
            {loading ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              'Save Changes'
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
