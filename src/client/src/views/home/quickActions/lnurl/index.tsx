import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { ColorButton } from '../../../../components/buttons/colorButton/ColorButton';
import { Card } from '../../../../components/generic/Styled';
import { InputWithDeco } from '../../../../components/input/InputWithDeco';
import Modal from '../../../../components/modal/ReactModal';
import { useAuthLnUrlMutation } from '../../../../graphql/mutations/__generated__/lnUrl.generated';
import { getErrorContent } from '../../../../utils/error';
import { decodeLnUrl } from '../../../../utils/url';
import { LnUrlModal } from './lnUrlModal';

export const LnUrlCard = () => {
  const [lnurl, setLnUrl] = useState<string>('');
  const [url, setUrl] = useState<string>('');
  const [type, setType] = useState<string>('');
  const [modalOpen, setModalOpen] = useState<boolean>(false);

  const [auth, { data, loading }] = useAuthLnUrlMutation({
    onError: error => toast.error(getErrorContent(error)),
  });

  useEffect(() => {
    if (loading || !data?.lnUrlAuth) return;

    const { status, message } = data.lnUrlAuth;
    if (status === 'ERROR') {
      toast.error(message);
    } else {
      toast.success(message);
      setLnUrl('');
      setUrl('');
      setType('');
    }
  }, [data, loading]);

  const handleDecode = () => {
    if (!lnurl) {
      toast.error('Please input a LNURL');
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
        auth({ variables: { url: urlString } });
      }
    } catch (error: any) {
      toast.error('Problem decoding LNURL');
    }
  };

  return (
    <>
      <Card>
        <InputWithDeco
          value={lnurl}
          placeholder={'LnPay / LnWithdraw / LnChannel / LnAuth'}
          title={'LNURL'}
          inputCallback={value => setLnUrl(value)}
          onEnter={() => handleDecode()}
        />
        <ColorButton
          arrow={true}
          fullWidth={true}
          disabled={!lnurl || loading}
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
