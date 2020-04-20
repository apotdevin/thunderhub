import React, { useState, useEffect } from 'react';
import {
  Sub4Title,
  ResponsiveLine,
  SubTitle,
  Separation,
  SingleLine,
  NoWrapTitle,
  DarkSubTitle,
} from '../../../../components/generic/Styled';
import { toast } from 'react-toastify';
import { getErrorContent } from '../../../../utils/error';
import { SecureButton } from '../../../../components/buttons/secureButton/SecureButton';
import { Input } from '../../../../components/input/Input';
import Modal from '../../../../components/modal/ReactModal';
import { useAccount } from '../../../../context/AccountContext';
import { ColorButton } from '../../../../components/buttons/colorButton/ColorButton';
import {
  renderLine,
  getNodeLink,
} from '../../../../components/generic/Helpers';
import { Price } from '../../../../components/price/Price';
import {
  usePayInvoiceMutation,
  useGetNodeLazyQuery,
  useDecodeRequestQuery,
} from '../../../../generated/graphql';
import { useStatusState } from '../../../../context/StatusContext';
import {
  isLightningInvoice,
  cleanLightningInvoice,
} from '../../../../utils/hhelpers';
import { KeysendModal, RequestModal } from './Modals';

export const PayCard = ({ setOpen }: { setOpen: () => void }) => {
  const [request, setRequest] = useState<string>('');
  const [tokens, setTokens] = useState<number>(0);
  const [modalType, setModalType] = useState('none');

  const { auth } = useAccount();
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
      arrow={true}
      fullWidth={true}
    >
      Send
    </SecureButton>
  );

  return (
    <>
      <ResponsiveLine>
        <NoWrapTitle>
          <Sub4Title as={'div'}>
            {canKeysend ? 'Invoice or Public Key:' : 'Invoice:'}
          </Sub4Title>
        </NoWrapTitle>
        <Input
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
