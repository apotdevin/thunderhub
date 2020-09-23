import { useState } from 'react';
import { toast } from 'react-toastify';
import { ColorButton } from 'src/components/buttons/colorButton/ColorButton';
import { Card } from 'src/components/generic/Styled';
import { InputWithDeco } from 'src/components/input/InputWithDeco';
import Modal from 'src/components/modal/ReactModal';
import { decodeLnUrl } from 'src/utils/url';
import { LnUrlModal } from './lnUrlModal';

export const LnUrlCard = () => {
  const [lnurl, setLnUrl] = useState<string>('');
  const [url, setUrl] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const handleDecode = () => {
    if (!lnurl) {
      toast.warning('Please input a LNURL');
      return;
    }
    try {
      const urlString = decodeLnUrl(lnurl);

      const url = new URL(urlString);
      const tag = url.searchParams.get('tag') || '';

      setUrl(urlString);
      setType(tag);

      if (url && tag !== 'login') {
        setModalOpen(true);
      }
      if (tag === 'login') {
        toast.warning('LnAuth is not available yet');
      }
    } catch (error) {
      toast.error('Problem decoding LNURL');
    }
  };

  return (
    <>
      <Card>
        <InputWithDeco
          value={lnurl}
          placeholder={'LnPay or LnWithdraw URL'}
          title={'LNURL'}
          inputCallback={value => setLnUrl(value)}
          onEnter={() => handleDecode()}
        />
        <ColorButton
          arrow={true}
          fullWidth={true}
          disabled={!lnurl}
          withMargin={'16px 0 0'}
          onClick={() => handleDecode()}
        >
          Confirm
        </ColorButton>
      </Card>
      <Modal isOpen={modalOpen} closeCallback={() => setModalOpen(false)}>
        <LnUrlModal url={url} type={type} />
      </Modal>
    </>
  );
};
