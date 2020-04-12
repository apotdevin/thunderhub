import React, { useState, useEffect } from 'react';
import {
  Sub4Title,
  ResponsiveLine,
  SubTitle,
  Separation,
  SingleLine,
} from '../../../../components/generic/Styled';
import { useMutation } from '@apollo/react-hooks';
import { PAY_INVOICE, DECODE_REQUEST } from '../../../../graphql/mutation';
import { toast } from 'react-toastify';
import { getErrorContent } from '../../../../utils/error';
import { SecureButton } from '../../../../components/buttons/secureButton/SecureButton';
import { Input } from '../../../../components/input/Input';
import { useSize } from '../../../../hooks/UseSize';
import Modal from '../../../../components/modal/ReactModal';
import { useAccount } from '../../../../context/AccountContext';
import { ColorButton } from '../../../../components/buttons/colorButton/ColorButton';
import {
  renderLine,
  getNodeLink,
} from '../../../../components/generic/Helpers';
import { Price } from '../../../../components/price/Price';
import { mediaDimensions } from '../../../../styles/Themes';

export const PayCard = ({ setOpen }: { setOpen: () => void }) => {
  const { width } = useSize();
  const [request, setRequest] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

  const { host, viewOnly, cert, sessionAdmin } = useAccount();
  const auth = {
    host,
    macaroon: viewOnly !== '' ? viewOnly : sessionAdmin,
    cert,
  };

  const [makePayment, { loading }] = useMutation(PAY_INVOICE, {
    onError: error => toast.error(getErrorContent(error)),
    onCompleted: () => {
      toast.success('Payment Sent');
      setRequest('');
      setModalOpen(false);
      setOpen();
    },
  });

  const [decode, { data, loading: decodeLoading }] = useMutation(
    DECODE_REQUEST,
    {
      onError: error => toast.error(getErrorContent(error)),
    }
  );

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
          withMargin={
            width <= mediaDimensions.mobile ? '0 0 16px' : '0 0 0 24px'
          }
          onChange={e => setRequest(e.target.value)}
        />
        <ColorButton
          disabled={request === ''}
          withMargin={width <= mediaDimensions.mobile ? '0' : '0 0 0 16px'}
          loading={decodeLoading}
          fullWidth={width <= mediaDimensions.mobile}
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
