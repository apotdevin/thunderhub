import { useState } from 'react';
import toast from 'react-hot-toast';
import { InputWithDeco } from '../../../../components/input/InputWithDeco';
import {
  MultiButton,
  SingleButton,
} from '../../../../components/buttons/multiButton/MultiButton';
import {
  Sub4Title,
  ResponsiveLine,
  NoWrapTitle,
} from '../../../../components/generic/Styled';
import { Input } from '../../../../components/input';
import Modal from '../../../../components/modal/ReactModal';
import { ColorButton } from '../../../../components/buttons/colorButton/ColorButton';
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
              <Sub4Title as={'div'}>Public Key</Sub4Title>
            </NoWrapTitle>
            <Input
              value={request}
              placeholder={'Public Key'}
              withMargin={'0 0 0 24px'}
              mobileMargin={'0 0 16px'}
              onChange={e => setRequest(e.target.value)}
              onEnter={() => handleClick()}
            />
            <ColorButton
              disabled={request === ''}
              withMargin={'0 0 0 16px'}
              mobileMargin={'0'}
              mobileFullWidth={true}
              onClick={() => handleClick()}
              arrow={true}
            >
              Decode
            </ColorButton>
          </ResponsiveLine>
        );
      default:
        return <Pay />;
    }
  };

  return (
    <>
      <InputWithDeco title={'Is Keysend'} noInput={true}>
        <MultiButton>
          <SingleButton selected={isKeysend} onClick={() => setIsKeysend(true)}>
            Yes
          </SingleButton>
          <SingleButton
            selected={!isKeysend}
            onClick={() => setIsKeysend(false)}
          >
            No
          </SingleButton>
        </MultiButton>
      </InputWithDeco>
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
