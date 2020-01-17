import React, { useState } from 'react';
import Modal from '../../modal/ReactModal';
import { LoginModal } from './LoginModal';
import { ColorButton } from '../../generic/Styled';
import { useAccount } from '../../../context/AccountContext';
import { getAuthString } from '../../../utils/auth';

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
                    macaroon={admin}
                    setModalOpen={setModalOpen}
                    callback={callback}
                    variables={variables}
                />
            </Modal>
        </>
    );
};
