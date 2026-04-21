import { ReactNode } from 'react';
import { Dialog, DialogContent, DialogTitle } from '../ui/dialog';

interface ModalProps {
  children: ReactNode;
  isOpen: boolean;
  noMinWidth?: boolean;
  closeCallback: () => void;
  title?: string;
}

const Modal = ({
  children,
  isOpen,
  noMinWidth = false,
  closeCallback,
  title = 'Dialog',
}: ModalProps) => {
  return (
    <Dialog
      open={isOpen}
      onOpenChange={open => {
        if (!open) closeCallback();
      }}
    >
      <DialogContent
        showCloseButton={false}
        aria-describedby={undefined}
        className={
          noMinWidth
            ? 'max-h-[80vh] overflow-y-auto'
            : 'max-h-[80vh] overflow-y-auto sm:max-w-144.5'
        }
      >
        <DialogTitle className="sr-only">{title}</DialogTitle>
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
