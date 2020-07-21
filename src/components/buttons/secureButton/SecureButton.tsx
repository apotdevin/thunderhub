import React, { useState } from 'react';
import { useAccountState, CLIENT_ACCOUNT } from 'src/context/AccountContext';
import { getAuthFromAccount } from 'src/context/helpers/context';
import Modal from '../../modal/ReactModal';
import { ColorButton, ColorButtonProps } from '../colorButton/ColorButton';
import { LoginModal } from './LoginModal';

interface SecureButtonProps extends ColorButtonProps {
  callback: (variables: {}) => void;
  disabled: boolean;
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

  const { session, account } = useAccountState();

  if (!account) {
    return null;
  }

  if (
    account &&
    account.type === CLIENT_ACCOUNT &&
    !account.admin &&
    !session
  ) {
    return null;
  }

  const auth = getAuthFromAccount(account, session);

  const handleClick = () => setModalOpen(true);

  const onClick =
    session || account.type !== CLIENT_ACCOUNT
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
      {account.type === CLIENT_ACCOUNT && (
        <Modal isOpen={modalOpen} closeCallback={() => setModalOpen(false)}>
          <LoginModal
            color={color}
            macaroon={account.admin}
            setModalOpen={setModalOpen}
            callback={callback}
            variables={variables}
          />
        </Modal>
      )}
    </>
  );
};
