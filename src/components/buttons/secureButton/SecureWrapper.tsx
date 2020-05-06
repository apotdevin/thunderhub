import React, { useState } from 'react';
import Modal from '../../modal/ReactModal';
import { LoginModal } from './LoginModal';
import { useAccount } from '../../../context/AccountContext';

interface SecureButtonProps {
  callback: any;
  children: any;
  variables: {};
  color?: string;
}

export const SecureWrapper: React.FC<SecureButtonProps> = ({
  callback,
  children,
  variables,
  color,
}) => {
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
      <div role={'button'} onClick={onClick} onKeyDown={onClick} tabIndex={0}>
        {children}
      </div>
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
