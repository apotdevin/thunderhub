import React, { ReactNode } from 'react';
import styled from 'styled-components';
import { cardColor } from '../../styles/Themes';
import ReactModal, { BaseModalBackground } from 'styled-react-modal';

export const FadingBackground = styled(BaseModalBackground)``;

interface ModalProps {
    children: ReactNode;
    isOpen: boolean;
    setIsOpen: (set: boolean) => void;
}

const StyleModal = ReactModal.styled`
        position: absolute;
         top: 50%;
         left: 50%;
         transform: translateY(-50%) translateX(-50%);
         background-color: ${cardColor};
         padding: 20px;
         border-radius: 5px;
         outline: none;
         min-width: 578px;

         @media (max-width: 578px) {
             top: 100%;
             border-radius: 0px;
             transform: translateY(-100%) translateX(-50%);
             width: 100%;
             min-width: 325px;
         }
`;

const Modal = ({ children, isOpen, setIsOpen }: ModalProps) => {
    return (
        <StyleModal
            isOpen={isOpen}
            onBackgroundClick={() => setIsOpen(!isOpen)}
            onEscapeKeydown={() => setIsOpen(!isOpen)}
        >
            {children}
        </StyleModal>
    );
};

export default Modal;
