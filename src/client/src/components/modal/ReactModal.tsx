import { ReactNode } from 'react';
import { Dialog, DialogContent } from '../ui/dialog';

interface ModalProps {
  children: ReactNode;
  isOpen: boolean;
  noMinWidth?: boolean;
  closeCallback: () => void;
}

const Modal = ({
  children,
  isOpen,
  noMinWidth = false,
  closeCallback,
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
        className={
          noMinWidth
            ? 'max-h-[80vh] overflow-y-auto'
            : 'max-h-[80vh] overflow-y-auto sm:max-w-[578px]'
        }
      >
        {children}
      </DialogContent>
    </Dialog>
  );
};

export default Modal;
