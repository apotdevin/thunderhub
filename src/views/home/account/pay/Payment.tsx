import React, { useState } from 'react';
import { toast } from 'react-toastify';
import {
  Sub4Title,
  ResponsiveLine,
  NoWrapTitle,
} from '../../../../components/generic/Styled';
import { Input } from '../../../../components/input/Input';
import Modal from '../../../../components/modal/ReactModal';
import { ColorButton } from '../../../../components/buttons/colorButton/ColorButton';
import { useStatusState } from '../../../../context/StatusContext';
import { isLightningInvoice } from '../../../../utils/helpers';
import { RequestModal } from './RequestModal';
import { KeysendModal } from './KeysendModal';
import { ModalType } from 'src/views/trading/Modal/FilterModal';

export const PayCard = ({ setOpen }: { setOpen: () => void }) => {
  const [request, setRequest] = useState<string>('');
  const [modalType, setModalType] = useState<ModalType>('none');

  const { minorVersion } = useStatusState();

  const canKeysend = minorVersion >= 9;

  const handleClick = () => {
    const isRequest = isLightningInvoice(request);

    if (!isRequest && canKeysend) {
      setModalType('keysend');
    } else {
      if (!isRequest) {
        toast.error('Invalid Invoice');
        return;
      }
      setModalType('request');
    }
  };

  const handleReset = () => {
    setRequest('');
    setModalType('none');
    setOpen();
  };

  const renderModal = () => {
    if (modalType === 'request') {
      return <RequestModal request={request} handleReset={handleReset} />;
    }
    if (modalType === 'keysend') {
      return <KeysendModal publicKey={request} handleReset={handleReset} />;
    }
    return null;
  };

  return (
    <>
      <ResponsiveLine>
        <NoWrapTitle>
          <Sub4Title as={'div'}>
            {canKeysend ? 'Invoice or Public Key:' : 'Invoice:'}
          </Sub4Title>
        </NoWrapTitle>
        <Input
          value={request}
          placeholder={
            canKeysend ? 'Lightning Invoice or Public Key' : 'Invoice'
          }
          withMargin={'0 0 0 24px'}
          mobileMargin={'0 0 16px'}
          onChange={e => setRequest(e.target.value)}
        />
        <ColorButton
          disabled={request === ''}
          withMargin={'0 0 0 16px'}
          mobileMargin={'0'}
          mobileFullWidth={true}
          onClick={() => handleClick()}
        >
          Send Sats
        </ColorButton>
      </ResponsiveLine>
      <Modal
        isOpen={modalType !== 'none'}
        closeCallback={() => {
          setModalType('none');
          setRequest('');
        }}
      >
        {renderModal()}
      </Modal>
    </>
  );
};
