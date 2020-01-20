import React, { useState } from 'react';
import Modal from '../../modal/ReactModal';
import { LoginModal } from './LoginModal';
import { useAccount } from '../../../context/AccountContext';
import { getAuthString } from '../../../utils/auth';
import { ColorButton } from '../colorButton/ColorButton';

interface SecureButtonProps {
    callback: any;
    color: string;
    disabled: boolean;
    children: any;
    variables: {};
    withMargin?: string;
    arrow?: boolean;
}

export const SecureButton = ({
    callback,
    color,
    disabled,
    children,
    variables,
    withMargin,
    arrow,
}: SecureButtonProps) => {
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    const { host, cert, admin, sessionAdmin } = useAccount();

    if (!admin && !sessionAdmin) {
        return null;
    }

    const auth = getAuthString(host, sessionAdmin, cert);

    const handleClick = () => setModalOpen(true);

    const onClick = sessionAdmin
        ? () => callback({ variables: { ...variables, auth } })
        : handleClick;

    return (
        <>
            <ColorButton
                withMargin={withMargin}
                arrow={arrow}
                color={color}
                disabled={disabled}
                onClick={onClick}
            >
                {children}
            </ColorButton>
            <Modal isOpen={modalOpen} setIsOpen={setModalOpen}>
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
