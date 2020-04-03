import React, { ReactNode } from 'react';
import { css } from 'styled-components';
import { cardColor, mediaWidths, themeColors } from '../../styles/Themes';
import ReactModal from 'styled-react-modal';

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

    @media (${mediaWidths.mobile}) {
        top: 100%;
        border-radius: 0px;
        transform: translateY(-100%) translateX(-50%);
        width: 100%;
        min-width: 325px;
    }
`;

const StyleModal = ReactModal.styled`
         ${generalCSS}
        min-width: 578px;
        `;

const StyleModalSmall = ReactModal.styled`
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
        <Styled
            isOpen={isOpen}
            onBackgroundClick={closeCallback}
            onEscapeKeydown={closeCallback}
        >
            {children}
        </Styled>
    );
};

export default Modal;
