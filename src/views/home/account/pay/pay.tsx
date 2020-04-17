import React, { useState, useEffect } from 'react';
import {
  Sub4Title,
  ResponsiveLine,
  SubTitle,
  Separation,
  SingleLine,
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
  useDecodeRequestMutation,
} from '../../../../generated/graphql';

export const PayCard = ({ setOpen }: { setOpen: () => void }) => {
  const [request, setRequest] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const { auth } = useAccount();

  const [makePayment, { loading }] = usePayInvoiceMutation({
    onError: error => toast.error(getErrorContent(error)),
    onCompleted: () => {
      toast.success('Payment Sent');
      setRequest('');
      setModalOpen(false);
      setOpen();
    },
  });

  const [decode, { data, loading: decodeLoading }] = useDecodeRequestMutation({
    onError: error => toast.error(getErrorContent(error)),
  });

  useEffect(() => {
    if (data && data.decodeRequest) setModalOpen(true);
  }, [data, setModalOpen]);

  const renderData = () => {
    if (!data || !data.decodeRequest) return null;

    const { description, destination, expiresAt, tokens } = data.decodeRequest;

    return (
      <>
        <SingleLine>
          <SubTitle>Pay Invoice</SubTitle>
          <Price amount={tokens} />
        </SingleLine>
        <Separation />
        {renderLine('Description:', description)}
        {renderLine('Destination:', getNodeLink(destination))}
        {renderLine('Expires At:', expiresAt)}
      </>
    );
  };

  return (
    <>
      <ResponsiveLine>
        <Sub4Title>Invoice:</Sub4Title>
        <Input
          placeholder={'Lightning Invoice'}
          withMargin={'0 0 0 24px'}
          mobileMargin={'0 0 16px'}
          onChange={e => setRequest(e.target.value)}
        />
        <ColorButton
          disabled={request === ''}
          withMargin={'0 0 0 16px'}
          mobileMargin={'0'}
          loading={decodeLoading}
          mobileFullWidth={true}
          onClick={() => {
            decode({ variables: { request, auth } });
          }}
        >
          Send Sats
        </ColorButton>
      </ResponsiveLine>
      <Modal isOpen={modalOpen} closeCallback={() => setModalOpen(false)}>
        {renderData()}
        <SecureButton
          callback={makePayment}
          variables={{ request }}
          disabled={request === ''}
          withMargin={'16px 0 0'}
          loading={loading}
          arrow={true}
          fullWidth={true}
        >
          Send
        </SecureButton>
      </Modal>
    </>
  );
};
