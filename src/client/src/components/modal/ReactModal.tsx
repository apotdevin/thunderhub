import React, { ReactNode } from 'react';
import styled, { css } from 'styled-components';
import { cardColor, mediaWidths, themeColors } from '../../styles/Themes';
import { Dialog } from 'radix-ui';
import { X } from 'react-feather';

interface ModalProps {
  children: ReactNode;
  isOpen: boolean;
  noMinWidth?: boolean;
  closeCallback: () => void;
}

const generalCSS = css`
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translateY(-50%) translateX(-50%);
  background-color: ${cardColor};
  padding: 20px;
  border-radius: 5px;
  outline: none;
  max-height: 80%;
  overflow-y: auto;
  border: 1px solid ${themeColors.grey8};

  @media (${mediaWidths.mobile}) {
    /* top: 100%; */
    border-radius: 0px;
    /* transform: translateY(-100%) translateX(-50%); */
    width: 100%;
    min-width: 325px;
    max-height: 100%;
  }
`;

const StyleModal = styled(Dialog.Content)`
  ${generalCSS}
  min-width: 578px;
`;

const StyleModalSmall = styled(Dialog.Content)`
  ${generalCSS}
  background-color: ${themeColors.white};
`;

const Modal = ({
  children,
  isOpen,
  noMinWidth = false,
  closeCallback,
}: ModalProps) => {
  const Styled = noMinWidth ? StyleModalSmall : StyleModal;

  return (
    <Dialog.Root
      open={isOpen}
      onOpenChange={open => {
        console.log(open);
        if (!open) {
          closeCallback();
        }
      }}
    >
      <Dialog.Portal>
        <Dialog.Overlay
          style={{
            backgroundColor: '#00000080',
            position: 'fixed',
            inset: '0',
          }}
        >
          <Styled>
            {children}

            <Dialog.Close asChild>
              <button
                aria-label="Close"
                style={{
                  position: 'fixed',
                  top: '10px',
                  right: '10px',
                  cursor: 'pointer',
                  backgroundColor: 'transparent',
                  color: 'inherit',
                  border: 'none',
                }}
              >
                <X size={16} />
              </button>
            </Dialog.Close>
          </Styled>
        </Dialog.Overlay>
      </Dialog.Portal>
    </Dialog.Root>
  );
};

export default Modal;
