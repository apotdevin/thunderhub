import React, { useState, useEffect } from 'react';
import QrReader from 'react-qr-reader';
import Modal from '../../modal/ReactModal';
import { toast } from 'react-toastify';
import { getQRConfig } from '../../../utils/auth';
import { Line, QRTextWrapper } from '../Auth.styled';
import sortBy from 'lodash.sortby';
import { LoadingBar } from '../../loadingBar/LoadingBar';
import { SubTitle } from '../../generic/Styled';
import { ColorButton } from '../../buttons/colorButton/ColorButton';

type QRLoginProps = {
  handleSet: ({
    name,
    host,
    admin,
    viewOnly,
    cert,
    skipCheck,
  }: {
    name?: string;
    host?: string;
    admin?: string;
    viewOnly?: string;
    cert?: string;
    skipCheck?: boolean;
  }) => void;
};

const QRLogin = ({ handleSet }: QRLoginProps) => {
  const [qrData, setQrData] = useState<any>([]);
  const [modalOpen, setModalOpen] = useState(true);
  const [modalClosed, setModalClosed] = useState('none');

  const [total, setTotal] = useState(0);
  const [missing, setMissing] = useState<number[]>();

  useEffect(() => {
    if (qrData.length >= total && total !== 0) {
      setModalOpen(false);

      const sorted = sortBy(qrData, 'index');
      const strings = sorted.map((code: { auth: string }) => code.auth);
      const completeString = strings.join('');

      try {
        const { name, cert, admin, viewOnly, host } = getQRConfig(
          completeString
        );

        handleSet({
          name,
          host,
          admin,
          viewOnly,
          cert,
          skipCheck: true,
        });
      } catch (error) {
        toast.error('Error reading QR codes.');
      }
    }
  }, [qrData, handleSet, total]);

  const handleScan = (data: string | null) => {
    if (data) {
      try {
        const parsed = JSON.parse(data);
        !total && setTotal(parsed.total);
        !missing && setMissing([...Array(parsed.total).keys()]);

        if (missing && missing.length >= 0 && missing.includes(parsed.index)) {
          const remaining = missing.filter((value: number) => {
            const currentNumber = Number(parsed.index);
            return value !== currentNumber;
          });
          const data = [...qrData, parsed];
          setQrData(data);
          setMissing(remaining);
        }
      } catch (error) {
        setModalOpen(false);
        toast.error('Error reading QR codes.');
      }
    }
  };

  const handleError = () => {
    setModalOpen(false);
    setModalClosed('error');
  };

  const handleClose = () => {
    setModalClosed('forced');
    setModalOpen(false);
    setMissing(undefined);
    setTotal(0);
    setQrData([]);
  };

  const renderInfo = () => {
    switch (modalClosed) {
      case 'forced':
        return (
          <>
            <QRTextWrapper>
              <SubTitle>No information read from QR Codes.</SubTitle>
            </QRTextWrapper>
            <ColorButton
              fullWidth={true}
              onClick={() => {
                setModalClosed('none');
                setModalOpen(true);
              }}
            >
              Try Again
            </ColorButton>
          </>
        );
      case 'error':
        return (
          <QRTextWrapper>
            <SubTitle>
              Make sure you have a camara available and that you have given
              ThunderHub the correct permissions to use it.
            </SubTitle>
          </QRTextWrapper>
        );
      default:
        return null;
    }
  };

  return (
    <>
      {renderInfo()}
      <Modal isOpen={modalOpen} closeCallback={handleClose}>
        <Line>
          <LoadingBar
            percent={missing ? 100 * ((total - missing.length) / total) : 0}
          />
        </Line>
        <QrReader
          delay={500}
          onError={handleError}
          onScan={handleScan}
          style={{ width: '100%' }}
        />
      </Modal>
    </>
  );
};

export default QRLogin;
