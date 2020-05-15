import React, { useState } from 'react';
import Modal from '../../modal/ReactModal';
import { useAccount } from '../../../context/AccountContext';
import { ColorButton, ColorButtonProps } from '../colorButton/ColorButton';
import { LoginModal } from './LoginModal';

interface SecureButtonProps extends ColorButtonProps {
  callback: any;
  disabled: boolean;
  children: any;
  variables: {};
  color?: string;
  withMargin?: string;
  mobileMargin?: string;
  arrow?: boolean;
}

export const SecureButton: React.FC<SecureButtonProps> = ({
  callback,
  color,
  disabled,
  children,
  variables,
  ...props
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
