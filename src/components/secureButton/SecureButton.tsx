import React, { useState } from 'react';
import Modal from '../modal/ReactModal';
import { LoginModal } from './LoginModal';
import { ColorButton } from '../generic/Styled';
import { useAccount } from '../../context/AccountContext';
import { getAuthString } from '../../utils/auth';

interface SecureButtonProps {
    callback: any;
    color: string;
    disabled: boolean;
    enabled: boolean;
    children: any;
    variables: {};
}

export const SecureButton = ({
    callback,
    color,
    enabled,
    disabled,
    children,
    variables,
}: SecureButtonProps) => {
    const [modalOpen, setModalOpen] = useState<boolean>(false);

    const { host, cert } = useAccount();

    const currentAuth = localStorage.getItem('account') || 'auth1';
    const adminMacaroon = localStorage.getItem(`${currentAuth}-admin`) || '';
    const sessionAdmin = sessionStorage.getItem('session') || '';

    if (!adminMacaroon && !sessionAdmin) {
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
                color={color}
                disabled={disabled}
                enabled={enabled}
                onClick={onClick}
            >
                {children}
            </ColorButton>
            <Modal isOpen={modalOpen} setIsOpen={setModalOpen}>
                <LoginModal
                    color={color}
                    macaroon={adminMacaroon}
                    setModalOpen={setModalOpen}
                    callback={callback}
                    variables={variables}
                />
            </Modal>
        </>
    );
};
