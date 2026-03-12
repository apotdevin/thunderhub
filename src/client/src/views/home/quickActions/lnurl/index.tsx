import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronRight, Loader2 } from 'lucide-react';
import { Card } from '../../../../components/generic/Styled';
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
    } catch {
      toast.error('Problem decoding LNURL');
    }
  };

  return (
    <>
      <Card>
        <div className="flex items-center w-full my-2 flex-col md:flex-row justify-between">
          <div className="flex text-sm whitespace-nowrap flex-wrap md:my-0 my-2">
            <span>LNURL</span>
          </div>
          <Input
            className="ml-0 md:ml-2"
            style={{ maxWidth: '500px' }}
            value={lnurl}
            placeholder={'LnPay / LnWithdraw / LnChannel / LnAuth'}
            onChange={e => setLnUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleDecode()}
          />
        </div>
        <Button
          variant="outline"
          className="w-full"
          disabled={!lnurl || loading}
          style={{ margin: '16px 0 0' }}
          onClick={() => handleDecode()}
        >
          {loading ? (
            <Loader2 className="animate-spin" size={16} />
          ) : (
            <>
              Confirm <ChevronRight size={18} />
            </>
          )}
        </Button>
      </Card>
      <Modal isOpen={modalOpen} closeCallback={() => setModalOpen(false)}>
        <LnUrlModal url={url} type={type} />
      </Modal>
    </>
  );
};
