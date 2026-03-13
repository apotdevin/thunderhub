import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ChevronRight, Loader2 } from 'lucide-react';
import Modal from '../../../../components/modal/ReactModal';
import { useAuthLnUrlMutation } from '../../../../graphql/mutations/__generated__/lnUrl.generated';
import { getErrorContent } from '../../../../utils/error';
import { decodeLnUrl } from '../../../../utils/url';
import { LnUrlModal } from './lnUrlModal';

export const LnUrlCard = () => {
  const [lnurl, setLnUrl] = useState('');
  const [url, setUrl] = useState('');
  const [type, setType] = useState('');
  const [modalOpen, setModalOpen] = useState(false);

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
      <div className="flex flex-col gap-3">
        <div className="flex flex-col gap-1">
          <label className="text-xs font-medium text-muted-foreground">
            LNURL
          </label>
          <Input
            value={lnurl}
            placeholder="LnPay / LnWithdraw / LnChannel / LnAuth"
            onChange={e => setLnUrl(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleDecode()}
          />
        </div>
        <Button
          variant="outline"
          className="w-full"
          disabled={!lnurl || loading}
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
      </div>
      <Modal isOpen={modalOpen} closeCallback={() => setModalOpen(false)}>
        <LnUrlModal url={url} type={type} />
      </Modal>
    </>
  );
};
