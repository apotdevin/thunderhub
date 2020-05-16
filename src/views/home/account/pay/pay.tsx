import React, { useState } from 'react';
import { toast } from 'react-toastify';
import { useAccountState } from 'src/context/AccountContext';
import {
  Sub4Title,
  ResponsiveLine,
  NoWrapTitle,
} from '../../../../components/generic/Styled';
import { getErrorContent } from '../../../../utils/error';
import { SecureButton } from '../../../../components/buttons/secureButton/SecureButton';
import { Input } from '../../../../components/input/Input';
import Modal from '../../../../components/modal/ReactModal';
import { ColorButton } from '../../../../components/buttons/colorButton/ColorButton';
import { usePayInvoiceMutation } from '../../../../generated/graphql';
import { useStatusState } from '../../../../context/StatusContext';
import {
  isLightningInvoice,
  cleanLightningInvoice,
} from '../../../../utils/helpers';
import { KeysendModal, RequestModal } from './Modals';

export const PayCard = ({ setOpen }: { setOpen: () => void }) => {
  const [request, setRequest] = useState<string>('');
  const [tokens, setTokens] = useState<number>(0);
  const [modalType, setModalType] = useState('none');

  const { auth } = useAccountState();
  const { minorVersion } = useStatusState();

  const canKeysend = minorVersion >= 9;

  const [makePayment, { loading }] = usePayInvoiceMutation({
    onError: error => toast.error(getErrorContent(error)),
    onCompleted: () => {
      toast.success('Payment Sent');
      setRequest('');
      setTokens(0);
      setModalType('none');
      setOpen();
    },
    refetchQueries: ['GetInOut', 'GetNodeInfo', 'GetBalances'],
  });

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

  const renderButton = () => (
    <SecureButton
      callback={makePayment}
      variables={
        modalType === 'none'
          ? { request: cleanLightningInvoice(request) }
          : { request, tokens }
      }
      disabled={
        modalType === 'request' ? request === '' : request === '' || tokens <= 0
      }
      withMargin={'16px 0 0'}
      loading={loading}
      fullWidth={true}
    >
      Send
    </SecureButton>
  );

  const renderModal = () => {
    if (modalType === 'request') {
      return (
        <RequestModal request={request} auth={auth}>
          {renderButton()}
        </RequestModal>
      );
    }
    if (modalType === 'keysend') {
      return (
        <KeysendModal
          tokens={tokens}
          auth={auth}
          publicKey={request}
          setTokens={setTokens}
        >
          {renderButton()}
        </KeysendModal>
      );
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
          setTokens(0);
          setRequest('');
        }}
      >
        {renderModal()}
      </Modal>
    </>
  );
};
