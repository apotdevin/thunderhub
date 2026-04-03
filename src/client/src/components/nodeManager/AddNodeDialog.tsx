import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { AddNodeForm } from './AddNodeForm';

interface AddNodeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onNodeAdded: (slug: string) => void;
}

export const AddNodeDialog = ({
  open,
  onOpenChange,
  onNodeAdded,
}: AddNodeDialogProps) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Add Node</DialogTitle>
          <DialogDescription>
            Connect a new Lightning node to your account.
          </DialogDescription>
        </DialogHeader>
        <AddNodeForm onNodeAdded={onNodeAdded} />
      </DialogContent>
    </Dialog>
  );
};
