import React, { useState } from 'react';
import Modal from '../../modal/ReactModal';
import { LoginModal } from './LoginModal';
import { useAccount } from '../../../context/AccountContext';
import { ColorButton } from '../colorButton/ColorButton';
import { ColorButtonProps } from '../colorButton/ColorButton';

interface SecureButtonProps extends ColorButtonProps {
    callback: any;
    disabled: boolean;
    children: any;
    variables: {};
    color?: string;
    withMargin?: string;
    arrow?: boolean;
}

export const SecureButton = ({
    callback,
    color,
    disabled,
    children,
    variables,
    ...props
}: SecureButtonProps) => {
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    const { host, cert, admin, sessionAdmin } = useAccount();

    if (!admin && !sessionAdmin) {
        return null;
    }

    const auth = { host, macaroon: sessionAdmin, cert };

    const handleClick = () => setModalOpen(true);

    const onClick = sessionAdmin
        ? () => callback({ variables: { ...variables, auth } })
        : handleClick;

    return (
        <>
            <ColorButton
                color={color}
                disabled={disabled}
                onClick={onClick}
                {...props}
            >
                {children}
            </ColorButton>
            <Modal isOpen={modalOpen} closeCallback={() => setModalOpen(false)}>
                <LoginModal
                    color={color}
                    macaroon={admin}
                    setModalOpen={setModalOpen}
                    callback={callback}
                    variables={variables}
                />
            </Modal>
        </>
    );
};
