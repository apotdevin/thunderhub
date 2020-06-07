import React, { useState } from 'react';
import { useAccountState, CLIENT_ACCOUNT } from 'src/context/AccountContext';
import { getAuthFromAccount } from 'src/context/helpers/context';
import Modal from '../../modal/ReactModal';
import { LoginModal } from './LoginModal';

interface SecureButtonProps {
  callback: (variables: {}) => void;
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

  const { account, session } = useAccountState();

  if (account.type === CLIENT_ACCOUNT && !account.admin && !session) {
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
      <div role={'button'} onClick={onClick} onKeyDown={onClick} tabIndex={0}>
        {children}
      </div>
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
