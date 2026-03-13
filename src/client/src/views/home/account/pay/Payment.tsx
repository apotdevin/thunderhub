import { useState } from 'react';
import toast from 'react-hot-toast';
import { Switch } from '@/components/ui/switch';
import {
  ResponsiveLine,
  NoWrapTitle,
} from '../../../../components/generic/Styled';
import { Input } from '@/components/ui/input';
import Modal from '../../../../components/modal/ReactModal';
import { Button } from '@/components/ui/button';
import { ChevronRight } from 'lucide-react';
import { isLightningInvoice } from '../../../../utils/helpers';
import { KeysendModal } from './KeysendModal';
import { Pay } from './Pay';

export const PayCard = ({ setOpen }: { setOpen: () => void }) => {
  const [request, setRequest] = useState<string>('');
  const [modalOpen, setModalOpen] = useState<boolean>(false);
  const [isKeysend, setIsKeysend] = useState<boolean>(false);

  const handleClick = () => {
    if (request === '') return;
    const isRequest = isLightningInvoice(request);

    if (!isRequest) {
      setModalOpen(true);
    } else {
      toast.error('Please Input a Public Key');
    }
  };

  const handleReset = () => {
    setRequest('');
    setModalOpen(false);
    setOpen();
  };

  const renderContent = () => {
    switch (true) {
      case isKeysend:
        return (
          <ResponsiveLine>
            <NoWrapTitle>
              <div className="my-2.5 font-medium">Public Key</div>
            </NoWrapTitle>
            <Input
              value={request}
              placeholder={'Public Key'}
              className="ml-0 md:ml-6"
              onChange={e => setRequest(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && handleClick()}
            />
            <Button
              variant="outline"
              disabled={request === ''}
              style={{ margin: '0 0 0 16px' }}
              className={cn('w-full md:w-auto')}
              onClick={() => handleClick()}
            >
              Decode <ChevronRight size={18} />
            </Button>
          </ResponsiveLine>
        );
      default:
        return <Pay />;
    }
  };

  return (
    <>
      <div className="flex items-center w-full my-2 flex-col md:flex-row justify-between">
        <div className="flex text-sm whitespace-nowrap flex-wrap md:my-0 my-2">
          <span>Is Keysend</span>
        </div>
        <Switch checked={isKeysend} onCheckedChange={setIsKeysend} />
      </div>
      {renderContent()}
      <Modal
        isOpen={modalOpen}
        closeCallback={() => {
          setModalOpen(false);
          setRequest('');
        }}
      >
        <KeysendModal publicKey={request} handleReset={handleReset} />
      </Modal>
    </>
  );
};
