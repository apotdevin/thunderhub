import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { X, Copy, ChevronRight, Loader2 } from 'lucide-react';
import { useSignMessageLazyQuery } from '../../../graphql/queries/__generated__/signMessage.generated';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import {
  SingleLine,
  DarkSubTitle,
  Separation,
} from '../../../components/generic/Styled';
import { getErrorContent } from '../../../utils/error';
import { NoWrap } from './Messages';

export const SignMessage = () => {
  const [message, setMessage] = useState<string>('');
  const [signed, setSigned] = useState<string>('');

  const [signMessage, { data, loading }] = useSignMessageLazyQuery({
    onError: error => toast.error(getErrorContent(error)),
  });

  useEffect(() => {
    if (!loading && data && data.signMessage) {
      setSigned(data.signMessage);
    }
  }, [loading, data]);

  const renderInput = () => (
    <>
      <SingleLine>
        <NoWrap>
          <DarkSubTitle>Message: </DarkSubTitle>
        </NoWrap>
        <Input
          style={{ margin: '8px 0 0' }}
          onChange={e => setMessage(e.target.value)}
        />
      </SingleLine>
      <Button
        variant="outline"
        onClick={() => signMessage({ variables: { message } })}
        className="w-full"
        style={{ margin: '8px 0 4px' }}
        disabled={message === '' || loading}
      >
        {loading ? <Loader2 className="animate-spin" size={16} /> : <>Sign</>}
      </Button>
    </>
  );

  const renderMessage = () => (
    <>
      <Separation />
      <div className="w-full h-full flex flex-col justify-center items-center">
        <div className="break-words m-6 text-sm">{signed}</div>
        <Button
          variant="outline"
          onClick={() =>
            navigator.clipboard
              .writeText(signed)
              .then(() => toast.success('Signature Copied'))
          }
        >
          <Copy size={18} />
          Copy
        </Button>
      </div>
    </>
  );

  return (
    <>
      {renderInput()}
      {signed !== '' && renderMessage()}
    </>
  );
};

export const SignMessageCard = () => {
  const [isPasting, setIsPasting] = useState<boolean>(false);

  return (
    <>
      <SingleLine>
        <DarkSubTitle>Sign Message</DarkSubTitle>
        <Button
          variant="outline"
          style={{ margin: '4px 0' }}
          onClick={() => setIsPasting(prev => !prev)}
        >
          {isPasting ? (
            <X size={18} />
          ) : (
            <>Sign {!isPasting && <ChevronRight size={18} />}</>
          )}
        </Button>
      </SingleLine>
      {isPasting && <SignMessage />}
    </>
  );
};
