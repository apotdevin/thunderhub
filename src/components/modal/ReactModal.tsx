import React, { ReactNode } from "react";
import ReactModal from "react-modal";
import "./ReactModal.scss";

interface ModalProps {
  children: ReactNode;
  isOpen: boolean;
}

const Modal = ({ children, isOpen }: ModalProps) => {
  return (
    <ReactModal
      isOpen={isOpen}
      className="react-modal"
      overlayClassName="react-modal__overlay"
      shouldFocusAfterRender={true}
    >
      {children}
    </ReactModal>
  );
};

export default Modal;
